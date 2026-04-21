import { Service } from '@/types/database';

/**
 * Static service data for Gabriel's Pharmacy
 * Based on the comprehensive services guide
 * 
 * Can be migrated to Supabase in the future by:
 * 1. Creating a 'services' table with matching schema
 * 2. Seeding the table with this data
 * 3. Updating lib/services.ts to query Supabase instead
 */
export const services: Service[] = [
  // Healthcare Monitoring Services
  {
    id: 'blood-pressure-monitoring',
    name: 'Blood Pressure Monitoring',
    slug: 'blood-pressure-monitoring',
    category: 'healthcare-monitoring',
    description: 'Non-invasive measurement of systolic and diastolic pressure using an automated blood pressure monitor. Essential for managing hypertension and preventing strokes and heart attacks.',
    duration: '2-3 minutes',
    priceRange: 'KES 50 - 100',
    icon: 'Activity',
    featured: true,
    keyInfo: [
      'Normal BP: Less than 120/80 mmHg',
      'High BP: 140/90 mmHg or higher',
      'Recorded in customer health profile'
    ],
    whoNeedsIt: 'People with hypertension, diabetes, pregnant women, general wellness checks'
  },
  {
    id: 'blood-glucose-testing',
    name: 'Blood Glucose Testing',
    slug: 'blood-glucose-testing',
    category: 'healthcare-monitoring',
    description: 'Quick blood test to check blood sugar levels using a digital glucometer. Results available within 5 seconds. Early detection prevents diabetes complications.',
    duration: '1-2 minutes',
    priceRange: 'KES 100 - 150',
    icon: 'Droplet',
    featured: true,
    keyInfo: [
      'Normal: Less than 100 mg/dL (fasting)',
      'Pre-diabetes: 100-125 mg/dL',
      'Diabetes: 126 mg/dL or higher'
    ],
    whoNeedsIt: 'Diabetics, pre-diabetics, obese individuals, family history of diabetes'
  },
  {
    id: 'malaria-testing',
    name: 'Malaria Rapid Diagnostic Test',
    slug: 'malaria-testing',
    category: 'healthcare-monitoring',
    description: 'Blood test to detect malaria parasites using rapid test kit. Quick turnaround for immediate treatment decisions.',
    duration: '15-20 minutes',
    priceRange: 'KES 150 - 200',
    icon: 'Bug',
    featured: false,
    keyInfo: [
      'Quick results in 15-20 minutes',
      'Positive results require immediate treatment',
      'Year-round malaria risk in Umoja area'
    ],
    whoNeedsIt: 'Anyone with fever, travelers to endemic areas, suspected malaria'
  },
  {
    id: 'cholesterol-testing',
    name: 'Cholesterol & Lipid Panel',
    slug: 'cholesterol-testing',
    category: 'healthcare-monitoring',
    description: 'Comprehensive blood test measuring total cholesterol, LDL, HDL, and triglycerides. Results available within 24-48 hours.',
    duration: '3-5 minutes',
    priceRange: 'KES 1,200-1,800',
    icon: 'HeartPulse',
    featured: false,
    keyInfo: [
      'Optimal Total Cholesterol: Less than 200 mg/dL',
      'HDL "Good": 60 mg/dL or higher',
      'LDL "Bad": Less than 100 mg/dL'
    ],
    whoNeedsIt: 'People over 40, heart disease risk, obesity, diabetes'
  },
  {
    id: 'hiv-testing',
    name: 'HIV Testing & Counseling',
    slug: 'hiv-testing',
    category: 'healthcare-monitoring',
    description: 'Confidential rapid test to detect HIV antibodies with pre and post-test counseling. Strict adherence to privacy laws.',
    duration: '15-30 minutes',
    priceRange: 'Free - KES 500',
    icon: 'Shield',
    featured: false,
    keyInfo: [
      'Completely confidential',
      'Includes pre and post-test counseling',
      'Referral to ART clinics if positive'
    ],
    whoNeedsIt: 'General screening, post-exposure assessment, routine wellness'
  },
  {
    id: 'wellness-screening',
    name: 'General Wellness Screening',
    slug: 'wellness-screening',
    category: 'healthcare-monitoring',
    description: 'Comprehensive health assessment including blood pressure, BMI, blood glucose, cholesterol check, and lifestyle assessment.',
    duration: '30-45 minutes',
    priceRange: 'KES 1,500-2,500',
    icon: 'HeartHandshake',
    featured: true,
    keyInfo: [
      'Complete health assessment package',
      'Personalized health report',
      'Cost-effective vs individual tests'
    ],
    whoNeedsIt: 'Anyone interested in preventive care and early detection'
  },

  // Pharmaceutical Services
  {
    id: 'prescription-filling',
    name: 'Prescription Filling & Verification',
    slug: 'prescription-filling',
    category: 'pharmaceutical',
    description: 'Expert verification and dispensing of prescribed medications with drug interaction checking, dosage verification, and patient counseling.',
    duration: '5-10 minutes',
    priceRange: 'Medication price + optional consultation',
    icon: 'Pill',
    featured: false,
    keyInfo: [
      'Licensed pharmacist verification',
      'Drug interaction database checking',
      'Clear labeling in English/Swahili'
    ],
    whoNeedsIt: 'Anyone with a doctor\'s prescription'
  },
  {
    id: 'medication-counseling',
    name: 'Medication Counseling',
    slug: 'medication-counseling',
    category: 'pharmaceutical',
    description: 'Expert advice on medication use, side effects, interactions, and proper administration. Personalized to your lifestyle.',
    duration: '10-15 minutes',
    priceRange: 'KES 200-500 (free with prescription)',
    icon: 'MessageSquare',
    featured: true,
    keyInfo: [
      'How to take medications correctly',
      'Potential side effects management',
      'Drug-drug and food interactions'
    ],
    whoNeedsIt: 'Anyone taking multiple medications or with questions about their prescriptions'
  },
  {
    id: 'injection-administration',
    name: 'Injection Administration',
    slug: 'injection-administration',
    category: 'pharmaceutical',
    description: 'Professional administration of prescribed injections including vitamin B12, iron, antibiotics, and hormone injections with sterile technique.',
    duration: '2-5 minutes',
    priceRange: 'KES 300-1,000',
    icon: 'Syringe',
    featured: false,
    keyInfo: [
      'Safe, professional administration',
      'Sterile technique used',
      'Proper medical waste disposal'
    ],
    whoNeedsIt: 'Patients with prescribed injections'
  },
  {
    id: 'wound-care',
    name: 'Wound Care & Dressing',
    slug: 'wound-care',
    category: 'pharmaceutical',
    description: 'Professional cleaning, disinfection, and bandaging of minor wounds with aftercare instructions and tetanus status assessment.',
    duration: '5-15 minutes',
    priceRange: 'KES 200-800',
    icon: 'Bandage',
    featured: false,
    keyInfo: [
      'Prevents infection and complications',
      'Professional dressing application',
      'Aftercare guidance provided'
    ],
    whoNeedsIt: 'Minor cuts, burns, abrasions requiring professional care'
  },

  // Health & Wellness Services
  {
    id: 'nutrition-counseling',
    name: 'Nutrition Counseling',
    slug: 'nutrition-counseling',
    category: 'health-wellness',
    description: 'Personalized dietary advice for health optimization including balanced diet for chronic diseases, weight management, and food-drug interactions.',
    duration: '15-20 minutes',
    priceRange: 'KES 500-1,000',
    icon: 'Apple',
    featured: false,
    keyInfo: [
      'Tailored to Kenyan dietary context',
      'Considers local food availability',
      'Improves medication effectiveness'
    ],
    whoNeedsIt: 'Anyone managing chronic diseases or seeking weight management'
  },
  {
    id: 'chronic-disease-management',
    name: 'Chronic Disease Management',
    slug: 'chronic-disease-management',
    category: 'health-wellness',
    description: 'Ongoing support for managing chronic conditions including medication refill scheduling, regular monitoring, and lifestyle advice.',
    duration: '10-15 minutes',
    priceRange: 'KES 300-500',
    icon: 'Calendar',
    featured: false,
    keyInfo: [
      'Improves treatment adherence',
      'Early detection of complications',
      'Reduces hospital admissions'
    ],
    whoNeedsIt: 'Patients with hypertension, diabetes, asthma, arthritis, high cholesterol'
  },
  {
    id: 'family-planning',
    name: 'Family Planning Consultation',
    slug: 'family-planning',
    category: 'health-wellness',
    description: 'Confidential counseling on contraceptive options and reproductive health with product availability information.',
    duration: '15-20 minutes',
    priceRange: 'Free - KES 200',
    icon: 'Users',
    featured: false,
    keyInfo: [
      'Confidential and judgment-free',
      'Multiple options explained',
      'Helps with informed decisions'
    ],
    whoNeedsIt: 'Adults seeking contraception information and counseling'
  },

  // Convenience Services
  {
    id: 'medicine-delivery',
    name: 'Medicine Delivery Service',
    slug: 'medicine-delivery',
    category: 'convenience',
    description: 'Same-day or next-day delivery of medications and health products to your home or office in Umoja and surrounding areas.',
    duration: 'Same-day / Next-day',
    priceRange: 'KES 100 - 300 delivery fee',
    icon: 'Truck',
    featured: true,
    keyInfo: [
      'Convenient for elderly and disabled',
      'Safe, discreet packaging',
      'Order via WhatsApp or phone'
    ],
    whoNeedsIt: 'Anyone unable to visit the pharmacy or preferring home delivery'
  },
  {
    id: 'prescription-reminders',
    name: 'Prescription Refill Reminders',
    slug: 'prescription-reminders',
    category: 'convenience',
    description: 'Automatic SMS/WhatsApp reminders when medications need refilling. Quick reorder via WhatsApp.',
    duration: 'Ongoing',
    priceRange: 'Free',
    icon: 'BellRing',
    featured: false,
    keyInfo: [
      'Never miss a refill',
      'Reminders 3-5 days before expiration',
      'Quick reorder process'
    ],
    whoNeedsIt: 'Patients on regular medications'
  },
  {
    id: '24-7-hotline',
    name: '24/7 Pharmacy Hotline',
    slug: '24-7-hotline',
    category: 'convenience',
    description: 'Round-the-clock phone support for medication questions, side effects, drug interactions, and emergency medication advice.',
    duration: 'Always Available',
    priceRange: 'Free',
    icon: 'Phone',
    featured: false,
    keyInfo: [
      'Always available for emergencies',
      'Professional guidance anytime',
      'WhatsApp and phone support'
    ],
    whoNeedsIt: 'Anyone needing medication advice outside regular hours'
  },

  // Education & Safety Services
  {
    id: 'health-education',
    name: 'Health Education Seminars',
    slug: 'health-education',
    category: 'education-safety',
    description: 'Regular workshops on health topics for the community including diabetes management, hypertension, women\'s health, and medication safety.',
    duration: '1-2 hours',
    priceRange: 'Free',
    icon: 'GraduationCap',
    featured: false,
    keyInfo: [
      'Free to the public',
      'Monthly or quarterly events',
      'Expert-led presentations'
    ],
    whoNeedsIt: 'Community members interested in health education'
  },
  {
    id: 'drug-disposal',
    name: 'Drug Disposal Program',
    slug: 'drug-disposal',
    category: 'education-safety',
    description: 'Safe collection and disposal of expired or unused medications following Kenyan pharmaceutical waste guidelines.',
    duration: '2-3 minutes',
    priceRange: 'Free',
    icon: 'Trash2',
    featured: false,
    keyInfo: [
      'Environmental protection',
      'Prevents accidental poisonings',
      'Proper waste management'
    ],
    whoNeedsIt: 'Anyone with expired or unused medications'
  }
];

// Service category metadata
export const serviceCategories = [
  {
    id: 'healthcare-monitoring',
    name: 'Healthcare Monitoring',
    slug: 'healthcare-monitoring',
    description: 'Diagnostic tests and health screenings',
    icon: 'Activity'
  },
  {
    id: 'pharmaceutical',
    name: 'Pharmaceutical Services',
    slug: 'pharmaceutical',
    description: 'Prescription filling and medication services',
    icon: 'Pill'
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Counseling and chronic disease support',
    icon: 'Heart'
  },
  {
    id: 'convenience',
    name: 'Convenience Services',
    slug: 'convenience',
    description: 'Delivery, reminders, and 24/7 support',
    icon: 'Truck'
  },
  {
    id: 'education-safety',
    name: 'Education & Safety',
    slug: 'education-safety',
    description: 'Health education and drug disposal',
    icon: 'GraduationCap'
  }
] as const;
