import { getFeaturedProducts } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';

export default async function FeaturedProducts() {
  let products = [];
  
  try {
    products = await getFeaturedProducts(12);
  } catch (error) {
    console.error('Error loading featured products:', error);
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-5 mb-10">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 pt-5">
          <h2 className="text-text-primary text-[22px] font-bold leading-tight tracking-tight">
            Featured Products
          </h2>
          <Link href="/products" className="text-primary text-sm font-medium hover:underline">
            View all
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
