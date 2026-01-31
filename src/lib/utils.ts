import type { ParsedPrice } from '@/types/database';

/**
 * Parse price string from scraped data
 * Handles formats like:
 * - "KSh2,287"
 * - "KSh7,245\nOriginal price was: KSh7,245.\nKSh6,521\nCurrent price is: KSh6,521."
 */
export function parsePrice(priceString: string): ParsedPrice {
  // Remove currency symbols and clean up
  const cleanPrice = priceString.replace(/KSh|Ksh|ksh/gi, '').trim();

  // Check if it contains discount info (multiple prices)
  const priceMatches = cleanPrice.match(/[\d,]+(?:\.\d{2})?/g);

  if (!priceMatches || priceMatches.length === 0) {
    return {
      currentPrice: 0,
      originalPrice: null,
      discountPercentage: 0,
      hasDiscount: false,
    };
  }

  // Parse numbers (remove commas)
  const prices = priceMatches.map((p) => parseFloat(p.replace(/,/g, '')));

  if (prices.length === 1) {
    // Single price, no discount
    return {
      currentPrice: prices[0],
      originalPrice: null,
      discountPercentage: 0,
      hasDiscount: false,
    };
  }

  // Multiple prices - first is original, last is current
  const originalPrice = prices[0];
  const currentPrice = prices[prices.length - 1];
  const discountPercentage = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );

  return {
    currentPrice,
    originalPrice,
    discountPercentage,
    hasDiscount: true,
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Generate URL-safe slug from text
 */
export function generateSlug(text: string, suffix?: string): string {
  let slug = text
    .toLowerCase()
    .trim()
    // Remove special characters
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');

  // Add suffix if provided (for uniqueness)
  if (suffix) {
    slug += `-${suffix}`;
  }

  return slug;
}

/**
 * Generate short UUID suffix for unique slugs
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8);
}

/**
 * Categorize product based on name/description keywords
 */
export function categorizeProduct(name: string, description?: string): string {
  const text = `${name} ${description || ''}`.toLowerCase();

  // Prescription keywords (check FIRST - most specific)
  if (
    /\b(prescription|rx|prescribed|antibiotic|amoxicillin|azithromycin|ciprofloxacin|metformin|lisinopril|amlodipine|atorvastatin|metoprolol|losartan|levothyroxine|albuterol|omeprazole|simvastatin|warfarin|insulin|gabapentin|hydrochlorothiazide)\b/i.test(
      text
    )
  ) {
    return 'prescriptions';
  }

  // OTC Meds keywords (expanded significantly)
  if (
    /\b(pain|relief|cold|flu|allergy|fever|cough|headache|aspirin|ibuprofen|paracetamol|panadol|tylenol|advil|motrin|antihistamine|antacid|gaviscon|tums|anti-diarrheal|imodium|laxative|dulcolax|motion sickness|dramamine|hydrocortisone|antifungal|athlete's foot|antiseptic|betadine|neosporin|bandage|first aid|nasal spray|throat lozenge|eye drops|ear drops|muscle rub|antibiotic cream|hemorrhoid|hydrocortisone cream)\b/i.test(
      text
    )
  ) {
    return 'otc-meds';
  }

  // Health Essentials keywords (more specific - removed generic "health")
  if (
    /\b(vitamin|multivitamin|supplement|mineral|omega-3|omega 3|fish oil|probiotic|protein powder|whey protein|calcium|iron|zinc|magnesium|vitamin [abcdek]|b12|b-12|d3|b-complex|folic acid|biotin|glucosamine|collagen|turmeric|immune boost|elderberry|echinacea|coq10|melatonin)\b/i.test(
      text
    )
  ) {
    return 'health-essentials';
  }

  // Default to general
  return 'general';
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(
  originalPrice: number,
  currentPrice: number
): number {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Format rating for display
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Generate random rating (for products without ratings)
 */
export function generateRandomRating(): number {
  // Generate realistic ratings between 4.0 and 5.0
  return parseFloat((Math.random() * 1 + 4).toFixed(1));
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Check if string is valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Delay execution (for rate limiting)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delayMs = baseDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }

  throw lastError!;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Sanitize filename for storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
