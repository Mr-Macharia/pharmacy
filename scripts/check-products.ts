import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProducts() {
  console.log('🔍 Checking product names and categories...\n');
  
  const { data: allProducts } = await supabase
    .from('products')
    .select('name, categories(slug)')
    .order('name', { ascending: true });

  console.log(`📦 Total products: ${allProducts?.length}\n`);

  // Group by category
  const byCategory: Record<string, string[]> = {};
  allProducts?.forEach(p => {
    const cat = p.categories?.slug || 'unknown';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p.name);
  });

  // Show counts
  console.log('📊 Category distribution:');
  Object.entries(byCategory).forEach(([cat, products]) => {
    console.log(`  ${cat}: ${products.length} products`);
  });

  console.log('\n🔬 Sample products from each category:');
  Object.entries(byCategory).forEach(([cat, products]) => {
    console.log(`\n${cat}:`);
    products.slice(0, 5).forEach(name => {
      console.log(`  - ${name}`);
    });
    if (products.length > 5) {
      console.log(`  ... and ${products.length - 5} more`);
    }
  });

  // Look for potential prescription medications
  console.log('\n💊 Potential prescription medications (common drug names):');
  const prescriptionKeywords = [
    'amoxicillin', 'augmentin', 'azithromycin', 'ciprofloxacin',
    'metformin', 'lisinopril', 'amlodipine', 'atorvastatin',
    'losartan', 'omeprazole', 'levothyroxine', 'albuterol',
    'gabapentin', 'hydrochlorothiazide', 'metoprolol', 'simvastatin',
    'warfarin', 'insulin', 'prednisone', 'tamsulosin', 'cephalexin',
    'doxycycline', 'penicillin', 'tetracycline', 'erythromycin'
  ];

  const potentialPrescriptions = allProducts?.filter(p => {
    const name = p.name.toLowerCase();
    return prescriptionKeywords.some(keyword => name.includes(keyword));
  });

  if (potentialPrescriptions && potentialPrescriptions.length > 0) {
    console.log(`Found ${potentialPrescriptions.length} products with prescription drug names:`);
    potentialPrescriptions.forEach(p => {
      console.log(`  - ${p.name} [currently: ${p.categories?.slug}]`);
    });
  } else {
    console.log('⚠️  No obvious prescription medications found by drug name');
    console.log('This is common - pharmacy databases often use brand names or generic descriptions');
  }

  console.log('\n💡 Suggestion: Check if products with "mg", "ml", dosage info should be prescriptions');
  const withDosage = allProducts?.filter(p => 
    /\d+\s?(mg|ml|mcg|g|%)\b/i.test(p.name)
  ).slice(0, 10);

  if (withDosage && withDosage.length > 0) {
    console.log('Sample products with dosage information:');
    withDosage.forEach(p => {
      console.log(`  - ${p.name} [${p.categories?.slug}]`);
    });
  }
}

checkProducts();
