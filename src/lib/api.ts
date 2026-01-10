import { supabase } from './supabase';
import type { Product, ProductWithCategory, Category, ProductFilters, PaginationParams, ProductsResponse } from '@/types/database';

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }

  return data || [];
}

/**
 * Fetch category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

/**
 * Fetch products with filters and pagination
 */
export async function getProducts(
  filters: ProductFilters = {},
  pagination: PaginationParams = { limit: 15, offset: 0 }
): Promise<ProductsResponse> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' });

  // Apply filters
  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.inStock !== undefined) {
    query = query.eq('in_stock', filters.inStock);
  }

  if (filters.minRating !== undefined) {
    query = query.gte('rating', filters.minRating);
  }

  // Apply pagination
  query = query
    .range(pagination.offset, pagination.offset + pagination.limit - 1)
    .order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }

  return {
    products: data || [],
    total: count || 0,
    limit: pagination.limit,
    offset: pagination.offset,
  };
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id: string): Promise<ProductWithCategory | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

/**
 * Fetch single product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

/**
 * Fetch featured products (highest rated, in stock)
 */
export async function getFeaturedProducts(limit: number = 12): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('in_stock', true)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }

  return data || [];
}

/**
 * Fetch related products (same category, excluding current product)
 */
export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit: number = 4
): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .neq('id', excludeProductId)
    .eq('in_stock', true)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return data || [];
}

/**
 * Search products (full-text search)
 */
export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .textSearch('search_vector', query, {
      type: 'websearch',
      config: 'english',
    })
    .limit(limit);

  if (error) {
    console.error('Error searching products:', error);
    // Fallback to simple name search
    return simpleSearchProducts(query, limit);
  }

  return data || [];
}

/**
 * Simple search fallback (ILIKE)
 */
async function simpleSearchProducts(query: string, limit: number): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error in simple search:', error);
    return [];
  }

  return data || [];
}

/**
 * Get product count by category
 */
export async function getProductCountByCategory(categoryId: string): Promise<number> {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId);

  if (error) {
    console.error('Error counting products:', error);
    return 0;
  }

  return count || 0;
}
