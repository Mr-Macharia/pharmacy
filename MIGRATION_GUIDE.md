# Migration Script Guide

## Prerequisites

1. **Supabase Setup Complete**: Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. **Environment Variables**: Update `.env.local` with your Supabase credentials
3. **Categories Created**: Ensure 4 categories exist in Supabase
4. **Storage Bucket**: `product-images` bucket created with public access
5. **Placeholder Image**: Upload `placeholder.webp` to `product-images/` bucket

## Running the Migration

```bash
# Install dependencies (if not already done)
npm install

# Run migration script
npm run migrate:products
```

## What the Script Does

1. **Loads Scraped Data**: Reads `live_scraped_products.json`
2. **Processes in Batches**: Handles 50 products at a time
3. **For Each Product**:
   - Parses price (handles discounts)
   - Auto-categorizes based on keywords
   - Generates unique URL slug
   - Downloads product image
   - Optimizes image (WebP, 800x800, 85% quality)
   - Uploads to Supabase Storage
   - Inserts product record to database
4. **Error Handling**: Logs failures to `migration-errors.json`
5. **Progress Updates**: Shows real-time progress in console

## Expected Output

```
🚀 Starting product migration...

📂 Loading scraped products from: ../live_scraped_products.json
📊 Found 1400 products to migrate

📁 Fetching categories from Supabase...
   Found 4 categories: prescriptions, otc-meds, health-essentials, general

============================================================
📦 Batch 1/28 (Products 1-50)
============================================================

📦 Processing: Ducray Keracnyl Foaming Gel Oily/Acne Prone 200Ml
   📥 Downloading image: https://...
   🔧 Optimizing image...
   ✅ Image optimized: 245.3KB → 78.2KB
   📤 Uploading to Supabase Storage: products/ducray-keracnyl-a3f5g8.webp
   ✅ Product inserted successfully

📊 Progress: 50/1400 (3.6%) | ✅ 48 | ❌ 2

...

============================================================
✨ Migration Complete!

Total Processed: 1400
Successfully Inserted: 1385
Failed: 15
Success Rate: 98.9%
============================================================
```

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env.local` file exists
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set

### Error: "Category not found"
- Run the SQL script in SUPABASE_SETUP.md to create categories
- Verify categories exist: `SELECT * FROM categories;`

### Error: "Upload failed: Bucket not found"
- Create `product-images` bucket in Supabase Storage
- Set bucket to public
- Add storage policies for read/write

### Error: "Image download failed"
- Check internet connection
- External image URLs may be blocked or rate-limited
- Script uses retry logic with exponential backoff

### High Failure Rate (>5%)
- Check `migration-errors.json` for patterns
- Common issues: invalid prices, broken image URLs
- Can re-run migration (duplicate slugs will be skipped)

## Re-running Migration

To re-run for failed products only:

1. Check `migration-errors.json` for failed products
2. Create a filtered JSON file with only failed products
3. Update script path to point to filtered file
4. Re-run migration

## Performance Tips

- **Batch Size**: Adjust `BATCH_SIZE` in script (default: 50)
- **Rate Limiting**: Adjust `RATE_LIMIT_DELAY` (default: 100ms)
- **Image Quality**: Adjust `IMAGE_QUALITY` (default: 85%)
- **Image Size**: Adjust `IMAGE_SIZE` (default: 800px)

## Estimated Duration

- **1,400 products**
- **~100ms per product** (download + optimize + upload)
- **Total: ~25-35 minutes**

Actual time varies based on:
- Internet speed
- External image server response times
- Supabase region latency

## After Migration

1. **Verify Data**:
   ```sql
   -- Check product count
   SELECT COUNT(*) FROM products;
   
   -- Check by category
   SELECT c.name, COUNT(p.id) as product_count
   FROM categories c
   LEFT JOIN products p ON c.id = p.category_id
   GROUP BY c.name;
   
   -- Check images
   SELECT COUNT(*) FROM products WHERE image_url IS NOT NULL;
   ```

2. **Test Frontend**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 and verify products display

3. **Review Errors**:
   - Check `migration-errors.json`
   - Manually fix problematic products if needed

## Storage Usage

- **~1,400 images** × **~80KB average** = **~112 MB**
- Supabase Free Tier: 1 GB storage (plenty of room)

---

**Created**: January 2026
