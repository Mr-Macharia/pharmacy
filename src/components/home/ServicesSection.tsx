import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedServices } from '@/lib/services';
import ServiceCard from '@/components/services/ServiceCard';

export default async function ServicesSection() {
  const featuredServices = await getFeaturedServices(4);

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Our Healthcare Services
            </h2>
            <p className="text-text-secondary max-w-2xl">
              Professional healthcare services beyond traditional pharmacy dispensing. 
              From diagnostic tests to medication counseling, we're here for your health needs.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all whitespace-nowrap"
          >
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-surface p-6 rounded-xl border border-border">
          <p className="text-text-secondary mb-4">
            Need help choosing the right service? Our pharmacists are available 24/7 on WhatsApp.
          </p>
          <a
            href="https://wa.me/254743490973?text=Hi%20Gabriel's%20Pharmacy!%20I%20need%20help%20choosing%20a%20service."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Chat with Pharmacist
          </a>
        </div>
      </div>
    </section>
  );
}
