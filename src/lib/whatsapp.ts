import type { WhatsAppInquiry, ServiceBookingInquiry } from '@/types/database';

const WHATSAPP_OWNER_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_OWNER_PHONE || '+254742535339';
const WHATSAPP_OWNER_NAME = process.env.NEXT_PUBLIC_WHATSAPP_OWNER_NAME || 'Gabriel';
const PHARMACY_NAME = "Gabriel's Pharmacy";

/**
 * Generate WhatsApp deep link URL
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  // Remove any non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Use wa.me format for universal compatibility
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate product inquiry message
 */
export function generateProductInquiry(inquiry: WhatsAppInquiry): string {
  const { productName, price, currency = 'KES', customMessage } = inquiry;

  if (customMessage) {
    return customMessage;
  }

  const message = `Hi ${PHARMACY_NAME}! 👋

I'm interested in: *${productName}*

Price: ${currency} ${price.toLocaleString('en-KE')}

Can you confirm availability and delivery options to my location?

Thank you!`;

  return message;
}

/**
 * Generate WhatsApp link for product inquiry
 */
export function getProductWhatsAppLink(inquiry: WhatsAppInquiry): string {
  const message = generateProductInquiry(inquiry);
  return generateWhatsAppUrl(WHATSAPP_OWNER_PHONE, message);
}

/**
 * Generate generic inquiry message
 */
export function generateGenericInquiry(message?: string): string {
  if (message) {
    return `Hi ${PHARMACY_NAME}! 👋\n\n${message}`;
  }

  return `Hi ${PHARMACY_NAME}! 👋

I'd like to inquire about medications and pharmacy services.

Can you help?

Thank you!`;
}

/**
 * Generate WhatsApp link for generic inquiry
 */
export function getGenericWhatsAppLink(message?: string): string {
  const inquiryMessage = generateGenericInquiry(message);
  return generateWhatsAppUrl(WHATSAPP_OWNER_PHONE, inquiryMessage);
}

/**
 * Generate prescription refill inquiry
 */
export function generatePrescriptionInquiry(medicationName: string): string {
  return `Hi ${PHARMACY_NAME}! 👋

I need to refill my prescription for: *${medicationName}*

Can you assist with this?

Thank you!`;
}

/**
 * Generate WhatsApp link for prescription refill
 */
export function getPrescriptionWhatsAppLink(medicationName: string): string {
  const message = generatePrescriptionInquiry(medicationName);
  return generateWhatsAppUrl(WHATSAPP_OWNER_PHONE, message);
}

/**
 * Generate consultation inquiry
 */
export function generateConsultationInquiry(): string {
  return `Hi ${PHARMACY_NAME}! 👋

I'd like to schedule a consultation with the pharmacist.

When would be a good time?

Thank you!`;
}

/**
 * Generate WhatsApp link for consultation
 */
export function getConsultationWhatsAppLink(): string {
  const message = generateConsultationInquiry();
  return generateWhatsAppUrl(WHATSAPP_OWNER_PHONE, message);
}

/**
 * Generate service booking inquiry message
 */
export function generateServiceBookingInquiry(inquiry: ServiceBookingInquiry): string {
  const { serviceName, preferredDate, customMessage } = inquiry;

  if (customMessage) {
    return customMessage;
  }

  const dateText = preferredDate ? `\n\nPreferred Date/Time: ${preferredDate}` : '';

  const message = `Hi ${PHARMACY_NAME}! 👋

I'm interested in: *${serviceName}*${dateText}

Please confirm availability and next steps.

Thank you!`;

  return message;
}

/**
 * Generate WhatsApp link for service booking
 */
export function getServiceBookingLink(inquiry: ServiceBookingInquiry): string {
  const message = generateServiceBookingInquiry(inquiry);
  return generateWhatsAppUrl(WHATSAPP_OWNER_PHONE, message);
}

/**
 * Generate bulk order inquiry
 */
export function generateBulkOrderInquiry(products: Array<{ name: string; quantity: number }>): string {
  const productList = products
    .map((p, i) => `${i + 1}. ${p.name} (Qty: ${p.quantity})`)
    .join('\n');

  return `Hi ${PHARMACY_NAME}! 👋

I'd like to place a bulk order for the following items:

${productList}

Can you provide pricing and delivery information?

Thank you!`;
}

/**
 * Generate WhatsApp link for bulk order
 */
export function getBulkOrderWhatsAppLink(products: Array<{ name: string; quantity: number }>): string {
  const message = generateBulkOrderInquiry(products);
  return generateWhatsAppUrl(WHATSAPP_OWNER_PHONE, message);
}

/**
 * Get pharmacy contact phone number
 */
export function getPharmacyPhone(): string {
  return WHATSAPP_OWNER_PHONE;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Format: +254 742 535 339
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('+254')) {
    const rest = cleaned.substring(4);
    return `+254 ${rest.substring(0, 3)} ${rest.substring(3, 6)} ${rest.substring(6)}`;
  }
  
  return phone;
}

/**
 * Check if WhatsApp is available (mobile detection)
 */
export function isWhatsAppAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  return isMobile;
}

/**
 * Open WhatsApp link (handles mobile app vs web)
 */
export function openWhatsAppLink(url: string): void {
  if (typeof window === 'undefined') return;
  
  // Open in new window/tab
  window.open(url, '_blank', 'noopener,noreferrer');
}
