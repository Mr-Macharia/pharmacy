'use client';

import { useState } from 'react';
import type { Service, ServiceCategory } from '@/types/database';
import ServiceCard from './ServiceCard';
import { getServiceCategories } from '@/lib/services';

interface ServiceGridProps {
  services: Service[];
}

export default function ServiceGrid({ services }: ServiceGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const categories = getServiceCategories();

  // Filter services based on selected category
  const filteredServices =
    selectedCategory === 'all'
      ? services
      : services.filter((service) => service.category === selectedCategory);

  return (
    <div className="flex flex-col gap-6">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface border border-border text-text-secondary hover:bg-border-light'
          }`}
        >
          All Services
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as ServiceCategory)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-text-secondary hover:bg-border-light'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-text-secondary">
        Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
        {selectedCategory !== 'all' && (
          <span className="font-medium text-text-primary">
            {' '}
            in {categories.find((c) => c.id === selectedCategory)?.name}
          </span>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary">
          <p>No services found in this category.</p>
        </div>
      )}
    </div>
  );
}
