import { supabase } from './supabase';
import type { Product, ProductWithCategory, Category, ProductFilters, PaginationParams, ProductsResponse } from '@/types/database';

/**
 * Search by intent - Stage 1 (fastest path)
 * Checks intent_to_products table for direct keyword matches
 * Returns product IDs if found, null if no match
 */
async function searchByIntent(searchTerm: string): Promise<string[] | null> {
  const normalizedTerm = searchTerm.toLowerCase().trim();
  
  // Try exact keyword match first
  const { data: exactMatch } = await supabase
    .from('intent_to_products')
    .select('product_ids')
    .eq('intent_keyword', normalizedTerm)
    .eq('is_active', true)
    .single();
  
  if ((exactMatch as any)?.product_ids?.length) {
    // Increment search count for analytics (fire and forget)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).rpc('increment_intent_search_count', { keyword: normalizedTerm }).then();
    return (exactMatch as any).product_ids;
  }
  
  // Try matching against search_variations array
  const { data: variationMatch } = await supabase
    .from('intent_to_products')
    .select('product_ids, intent_keyword')
    .contains('search_variations', [normalizedTerm])
    .eq('is_active', true)
    .limit(1)
    .single();
  
  if ((variationMatch as any)?.product_ids?.length) {
    // Increment count for the main keyword
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).rpc('increment_intent_search_count', { keyword: (variationMatch as any).intent_keyword }).then();
    return (variationMatch as any).product_ids;
  }
  
  return null;
}

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
 * Uses 2-stage search:
 * Stage 1: Intent lookup (fast path for symptoms/conditions)
 * Stage 2: Full-text/ILIKE search (fallback)
 */
export async function getProducts(
  filters: ProductFilters = {},
  pagination: PaginationParams = { limit: 15, offset: 0 }
): Promise<ProductsResponse> {
  // If search is provided, use the Supabase RPC for reliable hybrid search
  if (filters.search) {
    const searchTerm = filters.search.trim();

    // Stage 1: Try intent-based search first (for single terms or known intents)
    const words = searchTerm.split(/\s+/);
    if (words.length <= 2) {
      const intentProductIds = await searchByIntent(searchTerm);
      if (intentProductIds && intentProductIds.length > 0) {
        // Found intent match - fetch those specific products
        let intentQuery = supabase
          .from('products')
          .select('*, category:categories(*)', { count: 'exact' })
          .in('id', intentProductIds);
        
        if (filters.categoryId) intentQuery = intentQuery.eq('category_id', filters.categoryId);
        if (filters.minPrice !== undefined) intentQuery = intentQuery.gte('price', filters.minPrice);
        if (filters.maxPrice !== undefined) intentQuery = intentQuery.lte('price', filters.maxPrice);
        if (filters.inStock !== undefined) intentQuery = intentQuery.eq('in_stock', filters.inStock);

        intentQuery = intentQuery
          .range(pagination.offset, pagination.offset + pagination.limit - 1)
          .order('rating', { ascending: false });

        const { data, error, count } = await intentQuery;
        if (!error && data && data.length > 0) {
          return { products: data, total: count || data.length, limit: pagination.limit, offset: pagination.offset };
        }
      }
    }

    // Stage 2: Use the search_products RPC (hybrid full-text + ILIKE)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rpcData, error: rpcError } = await (supabase as any).rpc('search_products', {
      p_search_term: searchTerm,
      p_category_id: filters.categoryId || null,
      p_limit: pagination.limit,
      p_offset: pagination.offset,
    });

    if (!rpcError && rpcData) {
      // Count total matching for pagination - use a simpler count query
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%`);

      return {
        products: rpcData as Product[],
        total: count || rpcData.length,
        limit: pagination.limit,
        offset: pagination.offset,
      };
    }

    // Stage 3: Fallback to ILIKE if RPC fails
    const orConditions = words.map(term =>
      `name.ilike.%${term}%,description.ilike.%${term}%`
    ).join(',');
    let fallbackQuery = supabase
      .from('products')
      .select('*, category:categories(*)', { count: 'exact' })
      .or(orConditions);
    if (filters.categoryId) fallbackQuery = fallbackQuery.eq('category_id', filters.categoryId);
    fallbackQuery = fallbackQuery
      .range(pagination.offset, pagination.offset + pagination.limit - 1)
      .order('created_at', { ascending: false });

    const { data: fbData, error: fbError, count: fbCount } = await fallbackQuery;
    if (!fbError) {
      return { products: fbData || [], total: fbCount || 0, limit: pagination.limit, offset: pagination.offset };
    }

    return { products: [], total: 0, limit: pagination.limit, offset: pagination.offset };
  }

  // No search — standard filtered listing
  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' });

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
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
