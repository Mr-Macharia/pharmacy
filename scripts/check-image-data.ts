import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function checkImageData() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, image_url')
    .limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample products:');
  data?.forEach((product) => {
    console.log(`\nProduct: ${product.name}`);
    console.log(`Image URL: ${product.image_url}`);
    console.log(`Starts with http: ${product.image_url?.startsWith('http')}`);
  });
}

checkImageData();
