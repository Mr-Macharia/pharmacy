// Database Types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'in_stock' | 'created_at' | 'updated_at' | 'search_vector'>;
        Update: Partial<Omit<Product, 'id' | 'in_stock' | 'created_at' | 'updated_at' | 'search_vector'>>;
      };
    };
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount_percentage: number;
  currency: string;
  stock_quantity: number;
  in_stock: boolean; // computed field
  dosage: string | null;
  unit_quantity: string | null;
  manufacturer: string | null;
  sku: string | null;
  image_url: string | null;
  requires_prescription: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  search_vector?: any; // tsvector type
}

// Scraped Product Type (from JSON)
export interface ScrapedProduct {
  name: string;
  price: string;
  image_url: string;
  url: string;
  scraped_at: string;
}

// Parsed Price Result
export interface ParsedPrice {
  currentPrice: number;
  originalPrice: number | null;
  discountPercentage: number;
  hasDiscount: boolean;
}

// UI Types
export interface ProductCardProps {
  product: Product;
  category?: Category;
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

// Service Types
export type ServiceCategory = 
  | 'healthcare-monitoring'
  | 'pharmaceutical'
  | 'health-wellness'
  | 'convenience'
  | 'education-safety';

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  duration: string; // e.g., "2-3 minutes", "15-20 minutes"
  priceRange: string; // e.g., "Free", "KES 200-300", "KES 1,200-1,800"
  icon: string; // Lucide icon name
  featured?: boolean;
  keyInfo?: string[]; // Key highlights
  whoNeedsIt?: string; // Brief description
}

// WhatsApp Message Template
export interface WhatsAppInquiry {
  productId: string;
  productName: string;
  price: number;
  currency?: string;
  customMessage?: string;
}

export interface ServiceBookingInquiry {
  serviceName: string;
  preferredDate?: string;
  customMessage?: string;
}

// API Response Types
export interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export interface CategoryWithCount extends Category {
  product_count: number;
}

// Search and Filter Types
export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

// Migration Types
export interface MigrationResult {
  success: boolean;
  processed: number;
  inserted: number;
  failed: number;
  errors: MigrationError[];
}

export interface MigrationError {
  productName: string;
  error: string;
  timestamp: string;
}

// Cart Item (for future use if needed)
export interface CartItem {
  product: Product;
  quantity: number;
}
