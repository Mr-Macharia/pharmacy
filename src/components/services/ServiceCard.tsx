'use client';

import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import type { Service } from '@/types/database';
import { getServiceBookingLink } from '@/lib/whatsapp';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const whatsappLink = getServiceBookingLink({
    serviceName: service.name,
  });

  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Stethoscope;

  // Get category display name
  const categoryLabels: Record<string, string> = {
    'healthcare-monitoring': 'Healthcare Monitoring',
    'pharmaceutical': 'Pharmaceutical',
    'health-wellness': 'Health & Wellness',
    'convenience': 'Convenience',
    'education-safety': 'Education & Safety',
  };

  return (
    <div className="flex flex-col gap-4 bg-surface p-6 rounded-xl border border-border hover:shadow-lg transition-all group">
      {/* Icon & Category Badge */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <IconComponent className="w-6 h-6" />
        </div>
        <span className="text-xs font-medium text-text-secondary bg-border-light px-2 py-1 rounded-md">
          {categoryLabels[service.category]}
        </span>
      </div>

      {/* Service Info */}
      <div className="flex flex-col gap-2 flex-1">
        {/* Name */}
        <Link href={`/services/${service.slug}`}>
          <h3 className="text-text-primary text-lg font-bold leading-tight hover:text-primary transition-colors">
            {service.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
          {service.description}
        </p>

        {/* Duration & Price */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary mt-auto pt-2">
          <div className="flex items-center gap-1">
            <LucideIcons.Clock className="w-3.5 h-3.5" />
            <span>{service.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <LucideIcons.Tag className="w-3.5 h-3.5" />
            <span className="font-medium text-primary">{service.priceRange}</span>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <Link
          href={`/services/${service.slug}`}
          className="flex-1 px-4 py-2 bg-border-light text-text-primary text-sm font-medium rounded-lg hover:bg-border transition-colors text-center"
        >
          Learn More
        </Link>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors text-center flex items-center justify-center gap-2"
        >
          <LucideIcons.MessageCircle className="w-4 h-4" />
          Book Now
        </a>
      </div>
    </div>
  );
}
