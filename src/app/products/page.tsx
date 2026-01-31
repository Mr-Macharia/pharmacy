import { getProducts, getCategories, getCategoryBySlug } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';
import { getGenericWhatsAppLink, formatPhoneNumber, getPharmacyPhone } from '@/lib/whatsapp';
import { Phone, MessageCircle } from 'lucide-react';
import type { Category, Product, ProductsResponse } from '@/types/database';

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
          categorySlug === 'prescriptions' ? (
            // Special message for prescriptions category
            <div className="max-w-2xl mx-auto py-12">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 md:p-12 border border-border">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 9h-1.42l-3.712-6.496-1.736.992L17.277 9H6.723l3.145-5.504-1.736-.992L4.42 9H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1zM16 11v2h-3v3h-2v-3H8v-2h3V8h2v3h3z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
                    Prescription Medications Available In-Store
                  </h2>
                  <p className="text-text-secondary text-lg mb-6">
                    For prescription medications, please visit our pharmacy or contact us directly. Our licensed pharmacists are ready to help you with prescription refills and alternatives.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <a
                    href={getGenericWhatsAppLink("I'd like to inquire about prescription medications and alternatives.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-5 bg-success hover:bg-success/90 rounded-xl transition-all group text-white"
                  >
                    <MessageCircle className="w-6 h-6 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <p className="font-semibold">Chat on WhatsApp</p>
                      <p className="text-sm text-white/90">Quick response guaranteed</p>
                    </div>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a
                    href={`tel:${getPharmacyPhone()}`}
                    className="flex items-center gap-3 p-5 bg-primary hover:bg-primary/90 rounded-xl transition-all group text-white"
                  >
                    <Phone className="w-6 h-6 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <p className="font-semibold">Call Us</p>
                      <p className="text-sm text-white/90">{formatPhoneNumber(getPharmacyPhone())}</p>
                    </div>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>

                <div className="bg-white/60 backdrop-blur rounded-lg p-4 text-center">
                  <p className="text-sm text-text-secondary">
                    <strong>Note:</strong> Prescription medications require a valid doctor&apos;s prescription. We&apos;re here to guide you on alternatives and OTC options.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Generic empty state for other categories
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">
                {searchQuery || categorySlug 
                  ? 'No products found matching your criteria. Try adjusting your search or browse all products.'
                  : 'No products available. Please configure Supabase and run the migration.'}
              </p>
            </div>
          )
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
