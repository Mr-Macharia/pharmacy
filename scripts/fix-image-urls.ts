import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function fixImageUrls() {
  console.log('🔧 Fixing product image URLs...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const baseStorageUrl = `${supabaseUrl}/storage/v1/object/public/product-images`;

  // Get all products with relative image paths
  const { data: products, error } = await supabase
    .from('products')
    .select('id, image_url')
    .not('image_url', 'like', 'http%');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products?.length || 0} products with relative image URLs`);

  if (!products || products.length === 0) {
    console.log('✅ All image URLs are already absolute!');
    return;
  }

  // Update in batches
  let updated = 0;
  for (const product of products) {
    const fullUrl = `${baseStorageUrl}/${product.image_url}`;
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: fullUrl })
      .eq('id', product.id);

    if (updateError) {
      console.error(`Failed to update product ${product.id}:`, updateError);
    } else {
      updated++;
      if (updated % 50 === 0) {
        console.log(`  Updated ${updated}/${products.length}...`);
      }
    }
  }

  console.log(`\n✅ Updated ${updated} product image URLs!`);
  console.log(`Example URL: ${baseStorageUrl}/${products[0].image_url}`);
}

fixImageUrls();
