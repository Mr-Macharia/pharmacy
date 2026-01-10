import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseSchema() {
  console.log('🔍 Checking database schema...\n');

  try {
    // Check if tables exist
    console.log('1. Checking if tables exist:');
    const { data: tables, error: tablesError } = await supabase.rpc('pg_tables', {});
    
    // Try to query categories
    console.log('\n2. Querying categories table:');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);
    
    if (catError) {
      console.error('❌ Error querying categories:', catError);
    } else {
      console.log(`✅ Found ${categories?.length || 0} categories`);
      console.log('Sample:', categories?.[0]);
    }

    // Try to query products
    console.log('\n3. Querying products table:');
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (prodError) {
      console.error('❌ Error querying products:', prodError);
    } else {
      console.log(`✅ Found ${products?.length || 0} products`);
      console.log('Sample:', products?.[0]);
    }

    // Check foreign key constraints
    console.log('\n4. Checking foreign key constraints:');
    const { data: constraints, error: constraintsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT
          tc.constraint_name,
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'products';
      `
    });

    if (constraintsError) {
      console.error('❌ Error checking constraints:', constraintsError);
      
      // Alternative method - use raw SQL query
      console.log('\n5. Using alternative SQL query method:');
      const { data: rawData, error: rawError } = await supabase
        .from('products')
        .select('*, categories(*)');
      
      if (rawError) {
        console.error('❌ Error with join query:', rawError);
      } else {
        console.log('✅ Join query worked:', rawData?.[0]);
      }
    } else {
      console.log('✅ Foreign key constraints:', constraints);
    }

    // Test the problematic query
    console.log('\n6. Testing the problematic query (with category:categories(*)):');
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error with category query:', testError);
      console.log('\n💡 This is the error causing the issue!');
      
      // Try alternative syntax
      console.log('\n7. Trying alternative syntax - categories!products_category_id_fkey(*)');
      const { data: altData, error: altError } = await supabase
        .from('products')
        .select('*, categories!products_category_id_fkey(*)')
        .limit(1);
      
      if (altError) {
        console.error('❌ Alternative syntax failed:', altError);
      } else {
        console.log('✅ Alternative syntax worked!');
        console.log('Sample:', altData?.[0]);
      }
    } else {
      console.log('✅ Query succeeded!');
      console.log('Sample:', testData?.[0]);
    }

  } catch (error) {
    console.error('Fatal error:', error);
  }
}

checkDatabaseSchema();
