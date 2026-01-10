import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function cleanDuplicates() {
  console.log('🔍 Finding oldest records to delete...');
  
  const { data: allProducts } = await supabase
    .from('products')
    .select('id, name, created_at')
    .order('created_at', { ascending: true });
  
  if (!allProducts) {
    console.error('Failed to fetch products');
    return;
  }
  
  const total = allProducts.length;
  const keepCount = 402;
  const deleteCount = total - keepCount;
  
  console.log(`Total records: ${total}`);
  console.log(`Will keep: ${keepCount} (newest)`);
  console.log(`Will delete: ${deleteCount} (oldest)`);
  
  const idsToDelete = allProducts.slice(0, deleteCount).map(p => p.id);
  
  console.log(`\n⚠️  About to delete ${idsToDelete.length} records...`);
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to proceed...');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('\n🗑️  Deleting old records...');
  let deleted = 0;
  
  for (let i = 0; i < idsToDelete.length; i += 100) {
    const batch = idsToDelete.slice(i, i + 100);
    const { error } = await supabase.from('products').delete().in('id', batch);
    
    if (error) {
      console.error(`Error deleting batch ${i/100 + 1}:`, error);
    } else {
      deleted += batch.length;
      console.log(`  Deleted ${deleted}/${idsToDelete.length}`);
    }
  }
  
  console.log('\n✅ Cleanup complete!');
  
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`📊 Remaining products: ${count}`);
}

cleanDuplicates();
