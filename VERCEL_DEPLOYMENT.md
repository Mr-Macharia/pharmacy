# Vercel Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables Setup
Before deploying to Vercel, you need to add these environment variables in your Vercel project settings:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qgxfgpeqqrhtdtdpamra.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_OWNER_PHONE=+254742535339
NEXT_PUBLIC_WHATSAPP_OWNER_NAME=Gabriel

# App Configuration
NEXT_PUBLIC_APP_NAME=Gabriel's Pharmacy
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 2. Recategorize Products (Important!)

After fixing the categorization logic, run this script locally to update all product categories:

```bash
npm run recategorize
```

This will:
- Analyze all 1,400+ products
- Apply improved categorization logic
- Show before/after statistics
- Update categories in the database

### 3. Test Locally First

```bash
npm run dev
```

Test these features:
- ✅ Search products (type "vitamin", "pain relief", etc.)
- ✅ Filter by category
- ✅ Load more products while maintaining filters
- ✅ WhatsApp links work (+254742535339)

---

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Fix search and category system"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In Vercel dashboard, go to: Project Settings → Environment Variables
   - Add all variables from the checklist above
   - Make sure to add them for **Production**, **Preview**, and **Development**

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

---

## Post-Deployment Verification

### 1. Test Search Functionality
Visit: `https://your-domain.vercel.app/products`

Test queries:
- "vitamin" → Should show vitamins/supplements
- "pain" → Should show pain relief medications
- "paracetamol" → Should show paracetamol products
- "ibuprofen" → Should show ibuprofen products

### 2. Test Category Filters
- Click "OTC Meds" → Should show pain relievers, cold/flu meds
- Click "Health Essentials" → Should show vitamins, supplements
- Click "All Categories" → Should reset

### 3. Test WhatsApp Integration
- Click any product's "+" button
- Should open WhatsApp with +254742535339
- Message should pre-fill product details

### 4. Test Load More
- Scroll to bottom
- Click "Load More Products"
- Should load next 15 products
- Filters should persist

---

## Performance Optimization

### 1. Image Optimization
Vercel automatically optimizes images from Supabase. The `next.config.ts` already has:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.supabase.co',
    },
  ],
}
```

### 2. API Route Caching
API routes (`/api/products`) are automatically cached by Vercel. No additional config needed.

### 3. Static Generation
Product pages use `dynamic = 'force-dynamic'` to ensure fresh data on each request.

---

## Troubleshooting

### Issue: Products not loading
**Solution**: Check environment variables in Vercel dashboard. Make sure `SUPABASE_SERVICE_KEY` is set.

### Issue: Search returns no results
**Solution**: 
1. Check if products are actually in the database
2. Run `npm run recategorize` locally to fix categories
3. Verify API route is working: `https://your-domain.vercel.app/api/products?search=vitamin`

### Issue: WhatsApp links don't work
**Solution**: Verify `NEXT_PUBLIC_WHATSAPP_OWNER_PHONE=+254742535339` is set in Vercel.

### Issue: Images not loading
**Solution**: 
1. Check Supabase storage bucket is public
2. Verify image URLs in database start with `https://`
3. Check `next.config.ts` has correct `remotePatterns`

---

## Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to: Project Settings → Domains
   - Add your custom domain (e.g., `gabrielspharmacy.co.ke`)

2. **Configure DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel's nameservers

3. **Update Environment Variable**
   ```bash
   NEXT_PUBLIC_APP_URL=https://gabrielspharmacy.co.ke
   ```

---

## Monitoring & Analytics

### Built-in Vercel Analytics
- Go to: Project → Analytics
- Monitor:
  - Page views
  - API route performance
  - Real User Metrics (RUM)

### Performance Budget
Target metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s

---

## Cost Estimation

### Vercel Pro Plan ($20/month)
- Unlimited deployments
- 1TB bandwidth
- 1000 GB-hours of build execution
- Custom domains
- Team collaboration

### Free Hobby Plan
- Good for testing
- 100 GB bandwidth/month
- 100 GB-hours builds
- Limited to personal use

**Recommended**: Start with Hobby plan, upgrade to Pro when traffic increases.

---

## Next Steps After Deployment

1. ✅ Share live URL with stakeholders
2. ✅ Test on mobile devices
3. ✅ Monitor Vercel Analytics
4. ✅ Set up custom domain
5. ✅ Add products to database (if not done)
6. ✅ Configure Supabase Row Level Security
7. ✅ Set up email notifications (future)

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs

---

**Last Updated**: January 31, 2026
