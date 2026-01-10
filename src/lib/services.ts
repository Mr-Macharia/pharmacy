import { Service, ServiceCategory } from '@/types/database';
import { services, serviceCategories } from '@/data/services';

/**
 * Get all services
 * @param category Optional category filter
 * @returns Array of services
 */
export async function getServices(category?: ServiceCategory): Promise<Service[]> {
  if (category) {
    return services.filter((service) => service.category === category);
  }
  return services;
}

/**
 * Get a single service by slug
 * @param slug Service slug
 * @returns Service or null if not found
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const service = services.find((s) => s.slug === slug);
  return service || null;
}

/**
 * Get featured services for homepage
 * @param limit Maximum number of services to return
 * @returns Array of featured services
 */
export async function getFeaturedServices(limit: number = 4): Promise<Service[]> {
  return services.filter((service) => service.featured).slice(0, limit);
}

/**
 * Get services by category with category grouping
 * @returns Object with categories as keys and services as values
 */
export async function getServicesByCategory(): Promise<Record<ServiceCategory, Service[]>> {
  const grouped: Record<string, Service[]> = {};
  
  services.forEach((service) => {
    if (!grouped[service.category]) {
      grouped[service.category] = [];
    }
    grouped[service.category].push(service);
  });
  
  return grouped as Record<ServiceCategory, Service[]>;
}

/**
 * Get all service categories
 * @returns Array of service categories
 */
export function getServiceCategories() {
  return serviceCategories;
}

/**
 * Search services by name or description
 * @param query Search query
 * @returns Array of matching services
 */
export async function searchServices(query: string): Promise<Service[]> {
  const lowerQuery = query.toLowerCase();
  return services.filter(
    (service) =>
      service.name.toLowerCase().includes(lowerQuery) ||
      service.description.toLowerCase().includes(lowerQuery)
  );
}
