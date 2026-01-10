import Link from 'next/link';
import type { Category } from '@/types/database';

const defaultCategories = [
  {
    slug: 'prescriptions',
    name: 'Prescriptions',
    description: 'Easy refill & transfer',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
    bgColor: 'from-blue-50 to-blue-100',
  },
  {
    slug: 'otc-meds',
    name: 'OTC Meds',
    description: 'Cold, Flu & Allergy relief',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop',
    bgColor: 'from-green-50 to-green-100',
  },
  {
    slug: 'health-essentials',
    name: 'Health Essentials',
    description: 'Vitamins & Daily Supplements',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop',
    bgColor: 'from-orange-50 to-orange-100',
  },
];

export default function CategoriesSection() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-5">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 pt-5">
          <h2 className="text-text-primary text-[22px] font-bold leading-tight tracking-tight">
            Browse Categories
          </h2>
          <Link href="/products" className="text-primary text-sm font-medium hover:underline">
            View all
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {defaultCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col gap-3 p-4 rounded-xl hover:bg-surface hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-border"
            >
              {/* Category Image */}
              <div className={`w-full bg-gradient-to-br ${category.bgColor} aspect-video rounded-lg overflow-hidden relative`}>
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${category.imageUrl})` }}
                />
              </div>

              {/* Category Info */}
              <div>
                <p className="text-text-primary text-lg font-bold leading-normal">
                  {category.name}
                </p>
                <p className="text-text-secondary text-sm font-normal leading-normal">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
