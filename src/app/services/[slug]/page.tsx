import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag, MessageCircle, Info } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getServiceBySlug, getServices } from '@/lib/services';
import { getServiceBookingLink } from '@/lib/whatsapp';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.name} | Gabriel's Pharmacy`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const whatsappLink = getServiceBookingLink({
    serviceName: service.name,
  });

  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Stethoscope;

  // Get category display name
  const categoryLabels: Record<string, string> = {
    'healthcare-monitoring': 'Healthcare Monitoring',
    'pharmaceutical': 'Pharmaceutical Services',
    'health-wellness': 'Health & Wellness',
    'convenience': 'Convenience Services',
    'education-safety': 'Education & Safety',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-12">
          {/* Back Link */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          {/* Service Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Icon */}
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
              <IconComponent className="w-10 h-10" />
            </div>

            {/* Title & Meta */}
            <div className="flex-1">
              <div className="mb-3">
                <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                  {categoryLabels[service.category]}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                {service.name}
              </h1>

              {/* Duration & Price */}
              <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">{service.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  <span className="text-sm font-medium text-primary">{service.priceRange}</span>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Book via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">About This Service</h2>
              <p className="text-text-secondary leading-relaxed">{service.description}</p>
            </div>

            {/* Key Information */}
            {service.keyInfo && service.keyInfo.length > 0 && (
              <div className="bg-surface p-6 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-text-primary">Key Information</h3>
                </div>
                <ul className="space-y-2">
                  {service.keyInfo.map((info, index) => (
                    <li key={index} className="flex items-start gap-3 text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Who Needs It */}
            {service.whoNeedsIt && (
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">Who Needs This Service?</h3>
                <p className="text-text-secondary leading-relaxed">{service.whoNeedsIt}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 sticky top-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Ready to Book?</h3>
              <p className="text-text-secondary text-sm mb-6">
                Book this service via WhatsApp and get confirmation within minutes. Our pharmacists are available 24/7 to assist you.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Book Now on WhatsApp
              </a>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-text-secondary text-center">
                  Response time: Usually within 5 minutes
                </p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-surface p-6 rounded-xl border border-border">
              <h3 className="text-lg font-bold text-text-primary mb-4">Have Questions?</h3>
              <p className="text-text-secondary text-sm mb-4">
                Our licensed pharmacists are here to help answer any questions about this service.
              </p>
              <Link
                href="/services"
                className="w-full flex items-center justify-center px-4 py-2 bg-border-light text-text-primary text-sm font-medium rounded-lg hover:bg-border transition-colors"
              >
                Browse All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
