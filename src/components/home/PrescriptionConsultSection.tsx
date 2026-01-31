'use client';

import { Phone, MapPin, MessageCircle, Calendar } from 'lucide-react';
import { formatPhoneNumber, getPharmacyPhone, getGenericWhatsAppLink } from '@/lib/whatsapp';

export default function PrescriptionConsultSection() {
  const pharmacyPhone = getPharmacyPhone();
  const formattedPhone = formatPhoneNumber(pharmacyPhone);
  const consultWhatsAppLink = getGenericWhatsAppLink(
    "I'd like to consult about prescription medications and alternatives."
  );

  return (
    <section className="px-4 md:px-10 lg:px-40 py-10 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-[960px] mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 9h-1.42l-3.712-6.496-1.736.992L17.277 9H6.723l3.145-5.504-1.736-.992L4.42 9H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1zM16 11v2h-3v3h-2v-3H8v-2h3V8h2v3h3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-3">
                Need Prescription Medications?
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Visit our pharmacy for professional consultation on prescription alternatives and personalized medication advice from our licensed pharmacists.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center p-6 bg-surface rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">Expert Consultation</h3>
                <p className="text-sm text-text-secondary">
                  Talk to our licensed pharmacists about prescription alternatives and medication advice
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-surface rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">Available 24/7</h3>
                <p className="text-sm text-text-secondary">
                  Book a consultation anytime via WhatsApp or visit us during business hours
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-surface rounded-xl">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">Quick Response</h3>
                <p className="text-sm text-text-secondary">
                  Get rapid answers to your medication questions and prescription needs
                </p>
              </div>
            </div>

            {/* Contact Options */}
            <div className="border-t border-border pt-8">
              <h3 className="text-xl font-bold text-text-primary mb-6 text-center">
                How to Reach Us
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* WhatsApp Consultation */}
                <a
                  href={consultWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-success/10 hover:bg-success/20 rounded-xl transition-all group border-2 border-success/20 hover:border-success"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-success rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary mb-1">
                      WhatsApp Consultation
                    </p>
                    <p className="text-sm text-text-secondary">
                      Chat with our pharmacist now
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-success group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                {/* Phone Call */}
                <a
                  href={`tel:${pharmacyPhone}`}
                  className="flex items-center gap-4 p-6 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all group border-2 border-primary/20 hover:border-primary"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary mb-1">
                      Call Us Directly
                    </p>
                    <p className="text-sm text-text-secondary">
                      {formattedPhone}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Visit Us */}
              <div className="mt-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-border">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-text-primary mb-2">Visit Our Pharmacy</h4>
                    <p className="text-sm text-text-secondary mb-3">
                      Umoja, Nairobi, Kenya
                    </p>
                    <p className="text-xs text-text-tertiary">
                      Open 24/7 • Walk-in consultations welcome • No appointment needed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-text-tertiary">
                💊 Prescription medications require a valid doctor&apos;s prescription. Our pharmacists can guide you on alternatives and OTC options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
