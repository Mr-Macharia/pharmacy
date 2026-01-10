# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in details:
   - **Name**: gabriels-pharmacy
   - **Database Password**: (save this securely)
   - **Region**: Select closest to Nairobi (e.g., eu-west-1)
4. Click "Create new project" (takes ~2 minutes)

## Step 2: Get API Credentials

1. Go to **Project Settings** → **API**
2. Copy the following values to `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY` (⚠️ Keep secret!)

## Step 3: Create Database Tables

Run the following SQL in **SQL Editor**:

### 1. Create Categories Table

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon_url, display_order) VALUES
  ('Prescriptions', 'prescriptions', 'Easy refill & transfer', '/images/categories/prescriptions.jpg', 1),
  ('OTC Meds', 'otc-meds', 'Cold, Flu & Allergy relief', '/images/categories/otc-meds.jpg', 2),
  ('Health Essentials', 'health-essentials', 'Vitamins & Daily Supplements', '/images/categories/health-essentials.jpg', 3),
  ('General', 'general', 'Other pharmacy products', '/images/categories/general.jpg', 4);

-- Create index on slug
CREATE INDEX idx_categories_slug ON categories(slug);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON categories
  FOR SELECT USING (true);
```

### 2. Create Products Table

```sql
-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discount_percentage INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED,
  dosage TEXT,
  unit_quantity TEXT,
  manufacturer TEXT,
  sku TEXT UNIQUE,
  image_url TEXT,
  requires_prescription BOOLEAN DEFAULT false,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_rating ON products(rating DESC);

-- Create full-text search index
ALTER TABLE products ADD COLUMN search_vector tsvector;
CREATE INDEX idx_products_search ON products USING gin(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION products_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update search vector
CREATE TRIGGER products_search_update
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_trigger();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);
```

### 3. Create Updated_at Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to categories
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply to products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Settings:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Enabled
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/*`
4. Click "Create bucket"

### Upload Placeholder Image

1. Create a simple placeholder image or download one
2. Upload to `product-images/placeholder.webp`

### Set Storage Policy

Go to **Storage** → **Policies** → Click "New Policy":

```sql
-- Allow public read access to product images
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated uploads (for migration script)
CREATE POLICY "Authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'service_role'
  );
```

## Step 5: Verify Setup

Run this query in SQL Editor to verify:

```sql
-- Check categories
SELECT * FROM categories ORDER BY display_order;

-- Check products table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';

-- Check storage buckets
SELECT * FROM storage.buckets WHERE name = 'product-images';
```

## Step 6: Test Connection

Update `.env.local` with your credentials and run:

```bash
npm run dev
```

Visit `http://localhost:3000` - the app should start without errors.

## Next Steps

1. Run the migration script to import products:
   ```bash
   npm run migrate:products
   ```

2. Monitor migration progress in terminal
3. Check Supabase dashboard for imported products

## Troubleshooting

### Connection Issues
- Verify Supabase URL format: `https://xxx.supabase.co`
- Check API keys are correct (anon key should start with `eyJ...`)
- Ensure project is not paused (free tier pauses after 7 days inactivity)

### Permission Errors
- Verify RLS policies are created
- Check service_role key for migration script (has bypass RLS)
- Ensure storage bucket is public

### Migration Errors
- Check `migration-errors.json` for failed products
- Verify Sharp library is installed: `npm list sharp`
- Test image URL accessibility with curl

## Security Notes

⚠️ **Never commit `.env.local` to Git**
⚠️ **Keep `SUPABASE_SERVICE_KEY` secret** - it bypasses all security
✅ Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side operations
✅ RLS policies protect data even with public keys

---

**Created**: January 2026  
**Last Updated**: January 2026
