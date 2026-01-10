import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type {
  ScrapedProduct,
  MigrationResult,
  MigrationError,
  Database,
  Category,
} from '../src/types/database';
import {
  parsePrice,
  generateSlug,
  generateShortId,
  categorizeProduct,
  generateRandomRating,
  retryWithBackoff,
  sanitizeFilename,
  delay,
} from '../src/lib/utils';

// Configuration
const BATCH_SIZE = 50;
const IMAGE_SIZE = 800;
const IMAGE_QUALITY = 85;
const MAX_RETRIES = 3;
const RATE_LIMIT_DELAY = 100; // ms between requests

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Migration state
const errors: MigrationError[] = [];
let processed = 0;
let inserted = 0;
let failed = 0;

/**
 * Download and optimize image
 */
async function downloadAndOptimizeImage(
  imageUrl: string,
  productName: string
): Promise<Buffer | null> {
  try {
    console.log(`   📥 Downloading image: ${imageUrl.substring(0, 60)}...`);

    const response = await retryWithBackoff(
      () => fetch(imageUrl, { signal: AbortSignal.timeout(30000) }),
      MAX_RETRIES
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`   🔧 Optimizing image...`);

    // Optimize image with Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(IMAGE_SIZE, IMAGE_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: IMAGE_QUALITY })
      .toBuffer();

    console.log(
      `   ✅ Image optimized: ${(buffer.length / 1024).toFixed(1)}KB → ${(
        optimizedBuffer.length / 1024
      ).toFixed(1)}KB`
    );

    return optimizedBuffer;
  } catch (error) {
    console.error(`   ❌ Image download failed: ${(error as Error).message}`);
    return null;
  }
}

/**
 * Upload image to Supabase Storage
 */
async function uploadImageToSupabase(
  imageBuffer: Buffer,
  productSlug: string
): Promise<string> {
  const filename = `${productSlug}-${Date.now()}.webp`;
  const filepath = `products/${filename}`;

  console.log(`   📤 Uploading to Supabase Storage: ${filepath}`);

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filepath, imageBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return filepath;
}

/**
 * Get or create placeholder image path
 */
function getPlaceholderImagePath(): string {
  return 'placeholder.webp';
}

/**
 * Process single product
 */
async function processProduct(
  scrapedProduct: ScrapedProduct,
  categories: Map<string, string>
): Promise<boolean> {
  try {
    const { name, price: priceString, image_url, url } = scrapedProduct;

    console.log(`\n📦 Processing: ${name}`);

    // Parse price
    const parsedPrice = parsePrice(priceString);
    if (parsedPrice.currentPrice === 0) {
      throw new Error('Invalid price');
    }

    // Generate slug
    const baseSlug = generateSlug(name);
    const uniqueSlug = `${baseSlug}-${generateShortId()}`;

    // Categorize product
    const categorySlug = categorizeProduct(name);
    const categoryId = categories.get(categorySlug);

    if (!categoryId) {
      throw new Error(`Category not found: ${categorySlug}`);
    }

    // Download and optimize image
    let imagePath: string;
    if (image_url && image_url.startsWith('http')) {
      const imageBuffer = await downloadAndOptimizeImage(image_url, name);

      if (imageBuffer) {
        try {
          imagePath = await uploadImageToSupabase(imageBuffer, uniqueSlug);
        } catch (uploadError) {
          console.warn(`   ⚠️  Upload failed, using placeholder`);
          imagePath = getPlaceholderImagePath();
        }
      } else {
        imagePath = getPlaceholderImagePath();
      }
    } else {
      console.log(`   ℹ️  No valid image URL, using placeholder`);
      imagePath = getPlaceholderImagePath();
    }

    // Generate rating
    const rating = generateRandomRating();

    // Insert product
    const { error: insertError } = await supabase.from('products').insert({
      name,
      slug: uniqueSlug,
      category_id: categoryId,
      price: parsedPrice.currentPrice,
      original_price: parsedPrice.originalPrice,
      discount_percentage: parsedPrice.discountPercentage,
      currency: 'KES',
      stock_quantity: Math.floor(Math.random() * 50) + 10, // Random stock
      image_url: imagePath,
      rating,
      review_count: Math.floor(Math.random() * 20),
      requires_prescription: categorySlug === 'prescriptions',
      sku: generateShortId(),
    });

    if (insertError) {
      throw new Error(`Insert failed: ${insertError.message}`);
    }

    console.log(`   ✅ Product inserted successfully`);
    return true;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`   ❌ Failed: ${errorMessage}`);

    errors.push({
      productName: scrapedProduct.name,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return false;
  }
}

/**
 * Fetch categories from Supabase
 */
async function fetchCategories(): Promise<Map<string, string>> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug');

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  const categoryMap = new Map<string, string>();
  data.forEach((cat) => {
    categoryMap.set(cat.slug, cat.id);
  });

  return categoryMap;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting product migration...\n');

  try {
    // Load scraped products
    const scrapedDataPath = join(process.cwd(), '..', 'live_scraped_products.json');
    console.log(`📂 Loading scraped products from: ${scrapedDataPath}`);

    const fileContent = await readFile(scrapedDataPath, 'utf-8');
    const scrapedProducts: ScrapedProduct[] = JSON.parse(fileContent);

    console.log(`📊 Found ${scrapedProducts.length} products to migrate\n`);

    // Fetch categories
    console.log('📁 Fetching categories from Supabase...');
    const categories = await fetchCategories();
    console.log(`   Found ${categories.size} categories: ${Array.from(categories.keys()).join(', ')}\n`);

    // Process in batches
    const totalBatches = Math.ceil(scrapedProducts.length / BATCH_SIZE);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, scrapedProducts.length);
      const batch = scrapedProducts.slice(start, end);

      console.log(
        `\n${'='.repeat(60)}\n📦 Batch ${batchIndex + 1}/${totalBatches} (Products ${start + 1}-${end})\n${'='.repeat(60)}`
      );

      for (const product of batch) {
        const success = await processProduct(product, categories);

        processed++;
        if (success) {
          inserted++;
        } else {
          failed++;
        }

        // Rate limiting
        await delay(RATE_LIMIT_DELAY);
      }

      // Progress update
      const progress = ((processed / scrapedProducts.length) * 100).toFixed(1);
      console.log(
        `\n📊 Progress: ${processed}/${scrapedProducts.length} (${progress}%) | ✅ ${inserted} | ❌ ${failed}`
      );
    }

    // Save errors to file
    if (errors.length > 0) {
      const errorsPath = join(process.cwd(), 'migration-errors.json');
      await writeFile(errorsPath, JSON.stringify(errors, null, 2));
      console.log(`\n⚠️  ${errors.length} errors saved to: ${errorsPath}`);
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('✨ Migration Complete!\n');
    console.log(`Total Processed: ${processed}`);
    console.log(`Successfully Inserted: ${inserted}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((inserted / processed) * 100).toFixed(1)}%`);
    console.log('='.repeat(60) + '\n');

    const result: MigrationResult = {
      success: failed === 0,
      processed,
      inserted,
      failed,
      errors,
    };

    return result;
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
