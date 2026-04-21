import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { getServices } from '@/lib/services';
import ServiceGrid from '@/components/services/ServiceGrid';

export const metadata: Metadata = {
  title: 'Healthcare Services | Chalrose Pharmaceuticals Limited',
  description: 'Professional healthcare services including blood pressure monitoring, glucose testing, medication counseling, and more. Book your appointment via WhatsApp.',
};

export const dynamic = 'force-static';

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-12">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                Our Healthcare Services
              </h1>
              <p className="text-text-secondary text-lg">
                Professional healthcare services for the Umoja community
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-text-secondary max-w-3xl leading-relaxed">
            Chalrose Pharmaceuticals Limited offers comprehensive healthcare services beyond traditional medication dispensing. 
            From diagnostic tests and health screenings to medication counseling and chronic disease management, 
            we're here to support your health journey. Book any service easily via WhatsApp.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-12">
        <ServiceGrid services={services} />
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-12 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Need Help Choosing a Service?
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Our licensed pharmacists are available 24/7 to help you select the right service for your needs. 
            Chat with us on WhatsApp for personalized recommendations.
          </p>
          <a
            href="https://wa.me/254111258520?text=Hi%20Chalrose%20Pharmaceuticals!%20I%20need%20help%20choosing%20a%20service."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Chat with Pharmacist
          </a>
        </div>
      </section>
    </div>
  );
}
