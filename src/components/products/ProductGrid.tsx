'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category } from '@/types/database';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  initialProducts: Product[];
  categories: Category[];
  totalCount: number;
  initialLimit: number;
  initialCategory?: string;
  initialSearch?: string;
}

export default function ProductGrid({
  initialProducts,
  categories,
  totalCount: initialTotalCount,
  initialLimit,
  initialCategory = '',
  initialSearch = '',
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    // Convert slug to ID if initial category is a slug
    if (initialCategory) {
      const category = categories.find(c => c.slug === initialCategory);
      return category?.id || '';
    }
    return '';
  });
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [searchLoading, setSearchLoading] = useState(false);

  const hasMore = offset < totalCount;

  // Debounced search function
  const performSearch = useCallback(async (search: string, category: string) => {
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('limit', initialLimit.toString());
      params.append('offset', '0');

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts(data.products || []);
      setTotalCount(data.total || 0);
      setOffset(initialLimit);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  }, [initialLimit]);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery, selectedCategory);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, performSearch]);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('limit', initialLimit.toString());
      params.append('offset', offset.toString());

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts((prev) => [...prev, ...(data.products || [])]);
      setOffset((prev) => prev + initialLimit);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {searchLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary">
            {searchQuery || selectedCategory
              ? 'No products found matching your criteria'
              : 'No products available'}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !searchLoading && (
        <div className="flex justify-center pt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              `Load More Products`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
