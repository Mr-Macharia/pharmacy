import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Mail } from 'lucide-react';
import { formatPhoneNumber, getPharmacyPhone } from '@/lib/whatsapp';

export default function Footer() {
  const pharmacyPhone = getPharmacyPhone();
  const formattedPhone = formatPhoneNumber(pharmacyPhone);

  return (
    <footer className="bg-surface border-t border-border py-10 px-4 md:px-10 lg:px-40">
      <div className="max-w-[960px] mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-text-primary font-bold text-lg">
              <div className="w-32 h-32 flex items-center justify-center">
                <Image
                  src="/logo.webp"
                  alt="Chalrose Pharmaceuticals Logo"
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                />
              </div>
              Chalrose Pharmaceuticals Limited
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Your trusted partner for health and wellness in Umoja, Nairobi — providing quality medications and healthcare services.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={`tel:${pharmacyPhone}`}
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{formattedPhone}</span>
              </a>
              <div className="flex items-center gap-2 text-text-secondary">
                <MapPin className="w-4 h-4" />
                <span>Umoja, Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-text-primary font-bold mb-2">Shop</h4>
            <Link
              href="/consultations"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              Prescriptions
            </Link>
            <Link
              href="/products?category=otc-meds"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              OTC Medicine
            </Link>
            <Link
              href="/products?category=health-essentials"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              Vitamins & Supplements
            </Link>
            <Link
              href="/products"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              All Products
            </Link>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-text-primary font-bold mb-2">Support</h4>
            <Link
              href="/services"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              Healthcare Services
            </Link>
            <Link
              href="/services/medication-counseling"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              Pharmacist Consultation
            </Link>
            <Link
              href="/services/medicine-delivery"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              Delivery Info
            </Link>
            <a
              href={`https://wa.me/${pharmacyPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              Contact via WhatsApp
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-text-primary font-bold mb-2">Legal</h4>
            <Link
              href="#privacy"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#terms"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#returns"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              Returns & Refunds
            </Link>
            <Link
              href="#accessibility"
              className="text-text-secondary hover:text-primary text-sm transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-text-tertiary text-xs text-center sm:text-left">
              © {new Date().getFullYear()} Chalrose Pharmaceuticals Limited. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-text-tertiary text-xs">Available 24/7</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                <span className="text-success text-xs font-medium">Online Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
