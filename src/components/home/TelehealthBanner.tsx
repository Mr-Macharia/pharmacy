import { getConsultationWhatsAppLink } from '@/lib/whatsapp';
import { Heart, ArrowRight } from 'lucide-react';

export default function TelehealthBanner() {
  const consultLink = getConsultationWhatsAppLink();

  return (
    <div className="px-4 md:px-10 lg:px-40 py-5">
      <div className="max-w-[960px] mx-auto">
        <div className="w-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-8 justify-between border border-primary/20">
          {/* Left Content */}
          <div className="flex flex-col gap-3 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 justify-center sm:justify-start">
              <span className="bg-primary/10 text-primary p-1.5 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 9h-1.42l-3.712-6.496-1.736.992L17.277 9H6.723l3.145-5.504-1.736-.992L4.42 9H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1zM16 11v2h-3v3h-2v-3H8v-2h3V8h2v3h3z" />
                </svg>
              </span>
              <span className="text-primary font-bold text-sm tracking-wide uppercase">
                Pharmacist Services
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Need a prescription renewal?
            </h3>

            <p className="text-text-secondary max-w-md">
              Connect with our licensed pharmacist on WhatsApp in minutes. Get consultation for common conditions and prescription renewals.
            </p>

            <div className="pt-2">
              <a
                href={consultLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-surface hover:bg-white text-text-primary hover:text-primary font-bold py-2.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-border"
              >
                Start a Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Icon */}
          <div className="w-32 h-32 sm:w-48 sm:h-48 bg-surface rounded-full flex items-center justify-center shadow-lg relative shrink-0">
            <Heart className="w-16 h-16 sm:w-24 sm:h-24 text-primary/80" />
            <div className="absolute -bottom-2 -right-2 bg-success text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Online Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
