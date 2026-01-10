import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Client-side Supabase client (browser)
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
};

// Server-side Supabase client (API routes, Server Components)
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars:', { supabaseUrl: !!supabaseUrl, supabaseServiceKey: !!supabaseServiceKey });
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// Default client for Server Components (lazy-loaded)
let _supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;
export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(target, prop) {
    if (!_supabaseInstance) {
      _supabaseInstance = createServerClient();
    }
    return (_supabaseInstance as any)[prop];
  },
});

// Get Supabase Storage URL for images
export const getStorageUrl = (path: string): string => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  return `${supabaseUrl}/storage/v1/object/public/${path}`;
};

// Get product image URL
export const getProductImageUrl = (imagePath: string | null): string => {
  if (!imagePath) {
    return getStorageUrl('product-images/placeholder.webp');
  }
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, construct Supabase storage URL
  return getStorageUrl(`product-images/${imagePath}`);
};
