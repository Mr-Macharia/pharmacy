import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { categorizeProduct } from '../src/lib/utils';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CategoryStats {
  [key: string]: {
    before: number;
    after: number;
    changed: number;
  };
}

/**
 * Recategorize all products using improved categorization logic
 */
async function recategorizeProducts() {
  console.log('🚀 Starting product recategorization...\n');

  try {
    // Fetch all categories first
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, slug');

    if (catError) throw catError;

    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));
    console.log(`✅ Loaded ${categories.length} categories\n`);

    // Fetch all products
    console.log('📦 Fetching all products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, description, category_id')
      .order('created_at', { ascending: true });

    if (productsError) throw productsError;

    console.log(`✅ Found ${products.length} products\n`);

    const stats: CategoryStats = {};
    categories.forEach((cat) => {
      stats[cat.slug] = { before: 0, after: 0, changed: 0 };
    });

    let updated = 0;
    let unchanged = 0;
    const batchSize = 50;

    // Count current distribution
    const { data: currentCats } = await supabase
      .from('products')
      .select('category_id, categories(slug)');

    currentCats?.forEach((p: any) => {
      const slug = p.categories?.slug;
      if (slug && stats[slug]) {
        stats[slug].before++;
      }
    });

    console.log('📊 Current category distribution:');
    Object.entries(stats).forEach(([slug, data]) => {
      console.log(`   ${slug}: ${data.before} products`);
    });
    console.log('');

    // Process products in batches
    console.log('🔄 Recategorizing products...\n');

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const updates = [];

      for (const product of batch) {
        const newCategorySlug = categorizeProduct(
          product.name,
          product.description || undefined
        );
        const newCategoryId = categoryMap.get(newCategorySlug);

        if (newCategoryId && newCategoryId !== product.category_id) {
          updates.push({
            id: product.id,
            category_id: newCategoryId,
          });
          updated++;

          // Find old category slug
          const oldCat = categories.find((c) => c.id === product.category_id);
          if (oldCat) {
            stats[oldCat.slug].changed++;
          }
        } else {
          unchanged++;
        }

        if (newCategorySlug && stats[newCategorySlug]) {
          stats[newCategorySlug].after++;
        }
      }

      // Batch update
      if (updates.length > 0) {
        for (const update of updates) {
          const { error } = await supabase
            .from('products')
            .update({ category_id: update.category_id })
            .eq('id', update.id);

          if (error) {
            console.error(`   ❌ Failed to update product ${update.id}:`, error.message);
          }
        }
      }

      process.stdout.write(
        `   Progress: ${Math.min(i + batchSize, products.length)}/${products.length} products processed\r`
      );
    }

    console.log('\n\n✅ Recategorization complete!\n');

    console.log('📊 Results:');
    console.log(`   ✅ Updated: ${updated} products`);
    console.log(`   ⏭️  Unchanged: ${unchanged} products`);
    console.log(`   📦 Total: ${products.length} products\n`);

    console.log('📈 Category distribution changes:');
    Object.entries(stats).forEach(([slug, data]) => {
      const change = data.after - data.before;
      const changeSymbol = change > 0 ? '+' : '';
      console.log(
        `   ${slug}: ${data.before} → ${data.after} (${changeSymbol}${change}) [${data.changed} moved out]`
      );
    });

    console.log('\n✨ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run migration
recategorizeProducts();
