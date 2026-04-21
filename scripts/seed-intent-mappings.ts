import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Intent mappings based on actual product analysis
// Format: intent_keyword, intent_type, search_variations, keywords to match products
const INTENT_MAPPINGS = [
  // Pain Relief
  {
    intent_keyword: 'pain',
    intent_type: 'symptom',
    search_variations: ['ache', 'sore', 'hurts', 'hurting', 'painful'],
    product_keywords: ['panadol', 'ibuprofen', 'nurofen', 'pain', 'relief', 'analgesic'],
  },
  {
    intent_keyword: 'headache',
    intent_type: 'symptom',
    search_variations: ['head pain', 'migraine', 'head ache'],
    product_keywords: ['panadol', 'ibuprofen', 'nurofen', 'migraine', 'headache'],
  },
  {
    intent_keyword: 'period',
    intent_type: 'symptom',
    search_variations: ['menstrual', 'cramps', 'period pain', 'pms', 'menstruation'],
    product_keywords: ['period', 'menstrual', 'ibuprofen', 'panadol', 'cramp', 'kotex', 'pad'],
  },
  {
    intent_keyword: 'muscle',
    intent_type: 'body_part',
    search_variations: ['muscle pain', 'muscle ache', 'sore muscles', 'back pain'],
    product_keywords: ['muscle', 'deep heat', 'ibuprofen', 'pain'],
  },
  
  // Cold & Flu
  {
    intent_keyword: 'cold',
    intent_type: 'condition',
    search_variations: ['common cold', 'runny nose', 'stuffy nose', 'sniffles'],
    product_keywords: ['cold', 'flu', 'lemsip', 'benylin', 'vicks', 'decongestant'],
  },
  {
    intent_keyword: 'flu',
    intent_type: 'condition',
    search_variations: ['influenza', 'fever', 'chills', 'body aches'],
    product_keywords: ['flu', 'cold', 'lemsip', 'benylin', 'panadol', 'fever'],
  },
  {
    intent_keyword: 'cough',
    intent_type: 'symptom',
    search_variations: ['coughing', 'dry cough', 'wet cough', 'chesty cough'],
    product_keywords: ['cough', 'benylin', 'robitussin', 'ascoril', 'syrup', 'expectorant'],
  },
  {
    intent_keyword: 'sore throat',
    intent_type: 'symptom',
    search_variations: ['throat pain', 'scratchy throat', 'throat ache'],
    product_keywords: ['strepsils', 'throat', 'lozenge', 'andolex', 'betadine'],
  },
  {
    intent_keyword: 'fever',
    intent_type: 'symptom',
    search_variations: ['high temperature', 'feverish', 'burning up'],
    product_keywords: ['panadol', 'ibuprofen', 'fever', 'flu', 'cold'],
  },
  
  // Stomach & Digestion
  {
    intent_keyword: 'stomach',
    intent_type: 'body_part',
    search_variations: ['tummy', 'belly', 'gut', 'abdomen', 'digestive'],
    product_keywords: ['gaviscon', 'imodium', 'antacid', 'stomach', 'digest', 'rennie'],
  },
  {
    intent_keyword: 'heartburn',
    intent_type: 'symptom',
    search_variations: ['acid reflux', 'indigestion', 'acidic', 'gerd'],
    product_keywords: ['gaviscon', 'antacid', 'acid', 'reflux', 'heartburn', 'rennie'],
  },
  {
    intent_keyword: 'diarrhea',
    intent_type: 'symptom',
    search_variations: ['diarrhoea', 'loose stool', 'runny tummy', 'upset stomach'],
    product_keywords: ['imodium', 'diarrhea', 'diarrhoea'],
  },
  {
    intent_keyword: 'constipation',
    intent_type: 'symptom',
    search_variations: ['constipated', 'blocked', 'cant poop'],
    product_keywords: ['laxative', 'constipation', 'fiber', 'dulcolax'],
  },
  {
    intent_keyword: 'nausea',
    intent_type: 'symptom',
    search_variations: ['nauseous', 'queasy', 'sick feeling', 'motion sickness'],
    product_keywords: ['nausea', 'anti-emetic', 'motion', 'travel'],
  },
  
  // Vitamins & Supplements
  {
    intent_keyword: 'vitamins',
    intent_type: 'category',
    search_variations: ['vitamin', 'supplement', 'supplements', 'multivitamin'],
    product_keywords: ['vitamin', 'supplement', 'jamieson', 'natures aid', 'wellwoman', 'wellman'],
  },
  {
    intent_keyword: 'vitamin c',
    intent_type: 'category',
    search_variations: ['vit c', 'ascorbic acid', 'immunity'],
    product_keywords: ['vitamin c', 'vit c', 'ascorbic', 'immunity'],
  },
  {
    intent_keyword: 'vitamin d',
    intent_type: 'category',
    search_variations: ['vit d', 'd3', 'sunshine vitamin'],
    product_keywords: ['vitamin d', 'd3', 'd 3'],
  },
  {
    intent_keyword: 'omega',
    intent_type: 'category',
    search_variations: ['omega 3', 'fish oil', 'omega-3', 'fatty acids'],
    product_keywords: ['omega', 'fish oil', 'fatty acid'],
  },
  {
    intent_keyword: 'iron',
    intent_type: 'category',
    search_variations: ['iron supplement', 'anemia', 'anaemia'],
    product_keywords: ['iron', 'ferrous'],
  },
  {
    intent_keyword: 'calcium',
    intent_type: 'category',
    search_variations: ['calcium supplement', 'bones', 'bone health'],
    product_keywords: ['calcium', 'bone', 'magnesium'],
  },
  {
    intent_keyword: 'sleep',
    intent_type: 'symptom',
    search_variations: ['insomnia', 'cant sleep', 'sleep aid', 'sleepless'],
    product_keywords: ['melatonin', 'sleep', 'night'],
  },
  
  // Skin Care
  {
    intent_keyword: 'skin',
    intent_type: 'body_part',
    search_variations: ['skincare', 'skin care', 'face', 'facial'],
    product_keywords: ['cream', 'lotion', 'serum', 'moistur', 'skin', 'face', 'facial'],
  },
  {
    intent_keyword: 'acne',
    intent_type: 'condition',
    search_variations: ['pimples', 'spots', 'breakout', 'blemish', 'zits'],
    product_keywords: ['acne', 'blemish', 'effaclar', 'spot', 'salicylic'],
  },
  {
    intent_keyword: 'sunscreen',
    intent_type: 'category',
    search_variations: ['sun cream', 'sunblock', 'spf', 'sun protection', 'uv'],
    product_keywords: ['sunscreen', 'spf', 'sun', 'anthelios', 'uv'],
  },
  {
    intent_keyword: 'moisturizer',
    intent_type: 'category',
    search_variations: ['moisturiser', 'moisturizing', 'hydrating', 'dry skin'],
    product_keywords: ['moistur', 'cream', 'lotion', 'hydrat', 'cerave'],
  },
  {
    intent_keyword: 'eczema',
    intent_type: 'condition',
    search_variations: ['dermatitis', 'itchy skin', 'dry patches'],
    product_keywords: ['eczema', 'dermatitis', 'lipikar', 'cerave', 'emollient'],
  },
  
  // Baby & Kids
  {
    intent_keyword: 'baby',
    intent_type: 'category',
    search_variations: ['infant', 'newborn', 'babies', 'baby care'],
    product_keywords: ['baby', 'infant', 'child', 'kids', 'wellbaby', 'junior'],
  },
  {
    intent_keyword: 'diaper',
    intent_type: 'category',
    search_variations: ['nappy', 'diapers', 'nappies', 'diaper rash'],
    product_keywords: ['diaper', 'nappy', 'rash', 'baby'],
  },
  
  // Eye Care
  {
    intent_keyword: 'eyes',
    intent_type: 'body_part',
    search_variations: ['eye', 'eye care', 'vision'],
    product_keywords: ['eye', 'optive', 'optrex', 'visine', 'drops'],
  },
  {
    intent_keyword: 'dry eyes',
    intent_type: 'symptom',
    search_variations: ['eye dryness', 'itchy eyes', 'tired eyes'],
    product_keywords: ['optive', 'dry eye', 'eye drop', 'tears', 'lubricant'],
  },
  {
    intent_keyword: 'red eyes',
    intent_type: 'symptom',
    search_variations: ['bloodshot eyes', 'eye redness', 'irritated eyes'],
    product_keywords: ['visine', 'red eye', 'optrex', 'bloodshot'],
  },
  
  // Oral/Dental
  {
    intent_keyword: 'teeth',
    intent_type: 'body_part',
    search_variations: ['tooth', 'dental', 'oral', 'mouth'],
    product_keywords: ['tooth', 'dental', 'oral', 'mouthwash', 'toothpaste', 'listerine', 'colgate'],
  },
  {
    intent_keyword: 'toothache',
    intent_type: 'symptom',
    search_variations: ['tooth pain', 'dental pain', 'teeth hurt'],
    product_keywords: ['panadol', 'ibuprofen', 'dental', 'oral'],
  },
  {
    intent_keyword: 'mouthwash',
    intent_type: 'category',
    search_variations: ['mouth rinse', 'oral rinse', 'breath freshener'],
    product_keywords: ['mouthwash', 'listerine', 'oral', 'betadine gargle'],
  },
  
  // Women's Health
  {
    intent_keyword: 'pregnancy',
    intent_type: 'condition',
    search_variations: ['pregnant', 'prenatal', 'conception', 'fertility'],
    product_keywords: ['pregnancy', 'pregnant', 'prenatal', 'folic', 'test'],
  },
  {
    intent_keyword: 'pregnancy test',
    intent_type: 'category',
    search_variations: ['hcg test', 'am i pregnant'],
    product_keywords: ['pregnancy test', 'hcg'],
  },
  {
    intent_keyword: 'pads',
    intent_type: 'category',
    search_variations: ['sanitary pads', 'feminine pads', 'period pads'],
    product_keywords: ['pad', 'kotex', 'sanitary', 'feminine'],
  },
  
  // First Aid
  {
    intent_keyword: 'wound',
    intent_type: 'condition',
    search_variations: ['cut', 'scrape', 'injury', 'bleeding'],
    product_keywords: ['wound', 'antiseptic', 'betadine', 'bandage', 'dressing'],
  },
  {
    intent_keyword: 'antiseptic',
    intent_type: 'category',
    search_variations: ['disinfectant', 'antibacterial', 'germicide'],
    product_keywords: ['antiseptic', 'betadine', 'disinfect', 'antibacterial'],
  },
  
  // Allergy
  {
    intent_keyword: 'allergy',
    intent_type: 'condition',
    search_variations: ['allergies', 'allergic', 'hay fever', 'histamine'],
    product_keywords: ['allergy', 'antihistamine', 'cetirizine', 'loratadine', 'zyrtec', 'claritin'],
  },
  {
    intent_keyword: 'hayfever',
    intent_type: 'condition',
    search_variations: ['hay fever', 'pollen allergy', 'seasonal allergy'],
    product_keywords: ['antihistamine', 'allergy', 'hayfever', 'nasal'],
  },
  
  // Hygiene
  {
    intent_keyword: 'hygiene',
    intent_type: 'category',
    search_variations: ['cleanliness', 'sanitation', 'personal care'],
    product_keywords: ['sanitizer', 'soap', 'wash', 'hygiene', 'antibacterial'],
  },
  {
    intent_keyword: 'hand sanitizer',
    intent_type: 'category',
    search_variations: ['sanitiser', 'hand gel', 'alcohol gel'],
    product_keywords: ['sanitizer', 'sanitiser', 'hand', 'alcohol'],
  },
  
  // Popular Brands (so users can search by brand)
  {
    intent_keyword: 'panadol',
    intent_type: 'brand',
    search_variations: ['panadol advance', 'panadol extra'],
    product_keywords: ['panadol'],
  },
  {
    intent_keyword: 'nurofen',
    intent_type: 'brand',
    search_variations: ['nurofen express', 'nurofen plus'],
    product_keywords: ['nurofen'],
  },
  {
    intent_keyword: 'cerave',
    intent_type: 'brand',
    search_variations: ['cera ve'],
    product_keywords: ['cerave'],
  },
  {
    intent_keyword: 'la roche posay',
    intent_type: 'brand',
    search_variations: ['la roche-posay', 'laroche posay', 'lrp'],
    product_keywords: ['la roche', 'roche posay', 'roche-posay'],
  },
  {
    intent_keyword: 'strepsils',
    intent_type: 'brand',
    search_variations: ['strepsil'],
    product_keywords: ['strepsils'],
  },
  {
    intent_keyword: 'lemsip',
    intent_type: 'brand',
    search_variations: ['lem sip'],
    product_keywords: ['lemsip'],
  },
  {
    intent_keyword: 'gaviscon',
    intent_type: 'brand',
    search_variations: [],
    product_keywords: ['gaviscon'],
  },
];

async function findProductsByKeywords(keywords: string[]): Promise<string[]> {
  const productIds: Set<string> = new Set();
  
  for (const keyword of keywords) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name')
      .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`);
    
    if (error) {
      console.error(`Error searching for keyword "${keyword}":`, error);
      continue;
    }
    
    if (data) {
      data.forEach(product => productIds.add(product.id));
    }
  }
  
  return Array.from(productIds);
}

async function seedIntentMappings() {
  console.log('🌱 Starting intent mapping seed...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const mapping of INTENT_MAPPINGS) {
    console.log(`Processing: ${mapping.intent_keyword}...`);
    
    // Find products matching the keywords
    const productIds = await findProductsByKeywords(mapping.product_keywords);
    
    if (productIds.length === 0) {
      console.log(`  ⚠️  No products found for "${mapping.intent_keyword}"`);
      continue;
    }
    
    console.log(`  Found ${productIds.length} products`);
    
    // Upsert the intent mapping
    const { error } = await supabase
      .from('intent_to_products')
      .upsert({
        intent_keyword: mapping.intent_keyword,
        intent_type: mapping.intent_type,
        search_variations: mapping.search_variations,
        product_ids: productIds,
        priority: mapping.intent_type === 'brand' ? 8 : 5, // Brands get higher priority
        is_active: true,
      }, {
        onConflict: 'intent_keyword',
      });
    
    if (error) {
      console.error(`  ❌ Error:`, error.message);
      errorCount++;
    } else {
      console.log(`  ✅ Saved with ${productIds.length} products`);
      successCount++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total intents: ${INTENT_MAPPINGS.length}`);
}

// Run the seed
seedIntentMappings()
  .then(() => {
    console.log('\n✨ Seed complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seed failed:', error);
    process.exit(1);
  });
