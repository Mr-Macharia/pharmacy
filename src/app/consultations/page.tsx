import { Metadata } from 'next';
import { Phone, MessageCircle, MapPin, Clock, Shield, Users, Stethoscope } from 'lucide-react';
import { getGenericWhatsAppLink, formatPhoneNumber, getPharmacyPhone } from '@/lib/whatsapp';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Prescription Consultations | Gabriel\'s Pharmacy',
  description: 'Get professional consultation for prescription medications from our licensed pharmacists. Visit us in-store or contact us via WhatsApp for personalized medication advice.',
};

export default function ConsultationsPage() {
  const pharmacyPhone = getPharmacyPhone();
  const formattedPhone = formatPhoneNumber(pharmacyPhone);
  const consultWhatsAppLink = getGenericWhatsAppLink(
    "I'd like to consult about prescription medications and alternatives."
  );

  return (
    <div className="px-4 md:px-10 lg:px-40 py-10">
      <div className="max-w-[960px] mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Stethoscope className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Prescription Consultations
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Get professional guidance on prescription medications from our licensed pharmacists. We&apos;re here to help you with refills, alternatives, and personalized advice.
          </p>
        </div>

        {/* Why Consult Section */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 md:p-10 mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Why Consult With Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-white/80 rounded-xl">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-text-primary mb-2">Licensed Pharmacists</h3>
              <p className="text-sm text-text-secondary">
                Our team of certified pharmacists ensures safe and accurate medication guidance
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white/80 rounded-xl">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-text-primary mb-2">Personalized Care</h3>
              <p className="text-sm text-text-secondary">
                We take time to understand your health needs and provide tailored recommendations
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white/80 rounded-xl">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-bold text-text-primary mb-2">Quick Turnaround</h3>
              <p className="text-sm text-text-secondary">
                Fast response times and efficient prescription processing for your convenience
              </p>
            </div>
          </div>
        </div>

        {/* Services We Offer */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Our Prescription Services
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-surface border border-border rounded-xl">
              <h3 className="font-bold text-text-primary mb-2">💊 Prescription Refills</h3>
              <p className="text-sm text-text-secondary">
                Bring your prescription or contact us to arrange refills for your ongoing medications.
              </p>
            </div>
            <div className="p-6 bg-surface border border-border rounded-xl">
              <h3 className="font-bold text-text-primary mb-2">🔄 Medication Alternatives</h3>
              <p className="text-sm text-text-secondary">
                Ask about generic options or alternatives that may be more affordable or available.
              </p>
            </div>
            <div className="p-6 bg-surface border border-border rounded-xl">
              <h3 className="font-bold text-text-primary mb-2">📋 Drug Interaction Checks</h3>
              <p className="text-sm text-text-secondary">
                We review your medications to ensure there are no harmful interactions.
              </p>
            </div>
            <div className="p-6 bg-surface border border-border rounded-xl">
              <h3 className="font-bold text-text-primary mb-2">📞 Medication Counseling</h3>
              <p className="text-sm text-text-secondary">
                Get guidance on proper dosage, timing, and what to expect from your medications.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div className="bg-white rounded-2xl shadow-lg border border-border p-8 md:p-10 mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Get in Touch
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* WhatsApp */}
            <a
              href={consultWhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 bg-success hover:bg-success/90 rounded-xl transition-all group text-white"
            >
              <div className="flex-shrink-0">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">Chat on WhatsApp</p>
                <p className="text-sm text-white/90">Quick response • Available 24/7</p>
              </div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Phone */}
            <a
              href={`tel:${pharmacyPhone}`}
              className="flex items-center gap-4 p-6 bg-primary hover:bg-primary/90 rounded-xl transition-all group text-white"
            >
              <div className="flex-shrink-0">
                <Phone className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">Call Us</p>
                <p className="text-sm text-white/90">{formattedPhone}</p>
              </div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Visit Us */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-border">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-primary text-lg mb-2">Visit Our Pharmacy</h3>
                <p className="text-text-secondary mb-2">
                  Umoja, Nairobi, Kenya
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full text-text-secondary">
                    <Clock className="w-4 h-4" />
                    Open 24/7
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full text-text-secondary">
                    Walk-ins Welcome
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Important Information
          </h3>
          <p className="text-sm text-amber-700">
            Prescription medications require a valid doctor&apos;s prescription. Please bring your prescription when visiting the pharmacy. Our pharmacists can guide you on alternatives, generic options, and over-the-counter solutions when appropriate.
          </p>
        </div>

        {/* Browse OTC Products */}
        <div className="text-center">
          <p className="text-text-secondary mb-4">
            Looking for over-the-counter medications you can buy online?
          </p>
          <Link
            href="/products?category=otc-meds"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors"
          >
            Browse OTC Medications
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
