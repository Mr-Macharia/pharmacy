import { getProducts, getCategories } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';
import type { Category, Product, ProductsResponse } from '@/types/database';

const PRODUCTS_PER_PAGE = 15;

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  let productsData: ProductsResponse = { products: [], total: 0, limit: PRODUCTS_PER_PAGE, offset: 0 };
  let categories: Category[] = [];

  try {
    [productsData, categories] = await Promise.all([
      getProducts({}, { limit: PRODUCTS_PER_PAGE, offset: 0 }),
      getCategories(),
    ]);
  } catch (error) {
    console.error('Error loading products page:', error);
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-10">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            All Products
          </h1>
          <p className="text-text-secondary">
            Browse our complete collection of medications, vitamins, and health essentials
          </p>
        </div>

        {productsData.products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg">
              No products available. Please configure Supabase and run the migration.
            </p>
          </div>
        ) : (
          <ProductGrid
            initialProducts={productsData.products}
            categories={categories}
            totalCount={productsData.total}
            initialLimit={PRODUCTS_PER_PAGE}
          />
        )}
      </div>
    </div>
  );
}
