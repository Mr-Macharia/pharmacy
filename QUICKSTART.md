# Quick Start Guide - Gabriel's Pharmacy

Get the project running in **5 steps** (after Supabase setup).

## Step 1: Supabase Setup (15 minutes)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create new project: "gabriels-pharmacy"
3. Go to **SQL Editor**, run this:

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

-- Insert categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Prescriptions', 'prescriptions', 'Easy refill & transfer', 1),
  ('OTC Meds', 'otc-meds', 'Cold, Flu & Allergy relief', 2),
  ('Health Essentials', 'health-essentials', 'Vitamins & Daily Supplements', 3),
  ('General', 'general', 'Other pharmacy products', 4);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discount_percentage INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED,
  image_url TEXT,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  requires_prescription BOOLEAN DEFAULT false,
  sku TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_name ON products(name);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
```

4. Go to **Storage** → Create bucket:
   - Name: `product-images`
   - ✅ Public bucket
   - Click "Create"

5. Upload placeholder image:
   - Create a simple 800x800 image (any color/logo)
   - Save as `placeholder.webp`
   - Upload to `product-images/` bucket

6. Get your credentials:
   - Go to **Settings** → **API**
   - Copy:
     - Project URL
     - anon/public key
     - service_role key (⚠️ keep secret!)

## Step 2: Configure Environment Variables

Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_WHATSAPP_OWNER_PHONE=+254743490973
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run Migration (25-35 minutes)

```bash
npm run migrate:products
```

You'll see:
```
🚀 Starting product migration...
📊 Found 1400 products to migrate

📦 Processing: Ducray Keracnyl Foaming Gel...
   📥 Downloading image...
   🔧 Optimizing image...
   ✅ Product inserted successfully

📊 Progress: 50/1400 (3.6%) | ✅ 48 | ❌ 2
...
```

✅ **Migration complete!**

## Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see:
- ✅ Homepage with hero section
- ✅ 3 category cards
- ✅ Featured products grid
- ✅ WhatsApp links working

## 🎉 You're Ready!

### Test Checklist

- [ ] Homepage loads with products
- [ ] Click a product → Detail page loads
- [ ] Click "Chat on WhatsApp" → Opens WhatsApp
- [ ] Search works (try "vitamin")
- [ ] Category filter works
- [ ] "Load More" button loads more products
- [ ] Mobile responsive (test on phone)

### Next Steps

1. **Customize**: Update colors, logo, content
2. **Add Products**: Run migration with your own data
3. **Deploy**: Push to Vercel (see [README.md](./README.md))
4. **Go Live**: Share URL with customers!

## 🐛 Common Issues

### "Missing Supabase environment variables"
→ Check `.env.local` file exists and has correct values

### No products showing
→ Run migration script: `npm run migrate:products`

### Images not loading
→ Check Storage bucket is public, placeholder exists

### WhatsApp link doesn't work
→ Ensure phone number is in E.164 format: `+254743490973`

## 📚 Full Documentation

- [README.md](./README.md) - Full project documentation
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed Supabase guide
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration troubleshooting

## 💬 Need Help?

Check the project documentation or contact the development team.

---

**Last Updated**: January 2026
