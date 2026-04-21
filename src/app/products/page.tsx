import { getProducts, getCategories, getCategoryBySlug } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';
import type { Category, ProductsResponse } from '@/types/database';


const PRODUCTS_PER_PAGE = 15;

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const searchQuery = params.search;

  let productsData: ProductsResponse = { products: [], total: 0, limit: PRODUCTS_PER_PAGE, offset: 0 };
  let categories: Category[] = [];
  let selectedCategory: Category | null = null;

  try {
    // Fetch categories first
    categories = await getCategories();

    // Get category ID if category slug provided
    let categoryId: string | undefined;
    if (categorySlug) {
      selectedCategory = await getCategoryBySlug(categorySlug);
      categoryId = selectedCategory?.id;
    }

    // Fetch products with filters
    productsData = await getProducts(
      { 
        categoryId,
        search: searchQuery 
      }, 
      { limit: PRODUCTS_PER_PAGE, offset: 0 }
    );
  } catch (error) {
    console.error('Error loading products page:', error);
  }

  // Dynamic page title based on category
  const pageTitle = selectedCategory 
    ? selectedCategory.name 
    : searchQuery 
    ? `Search Results for "${searchQuery}"` 
    : 'All Products';

  const pageDescription = selectedCategory?.description || 'Browse our complete collection of medications, vitamins, and health essentials';

  return (
    <div className="px-4 md:px-10 lg:px-40 py-10">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {pageTitle}
          </h1>
          <p className="text-text-secondary">
            {pageDescription}
          </p>
        </div>

        {productsData.products.length === 0 ? (
          // Generic empty state for all categories (including prescriptions)
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg">
              {searchQuery || categorySlug 
                ? 'No products found matching your criteria. Try adjusting your search or browse all products.'
                : 'No products available. Please configure Supabase and run the migration.'}
            </p>
          </div>
        ) : (
          <ProductGrid
            initialProducts={productsData.products}
            categories={categories}
            totalCount={productsData.total}
            initialLimit={PRODUCTS_PER_PAGE}
            initialCategory={categorySlug}
            initialSearch={searchQuery}
          />
        )}
      </div>
    </div>
  );
}
