# 🚀 Deployment Checklist - Gabriel's Pharmacy

Use this checklist to ensure everything is set up correctly before going live.

---

## Phase 1: Pre-Deployment Setup ⚠️

### 1. Supabase Configuration
- [ ] Created Supabase project at [supabase.com](https://supabase.com/dashboard)
- [ ] Ran all SQL migrations in SQL Editor
  - [ ] Created `categories` table
  - [ ] Inserted 4 default categories
  - [ ] Created `products` table with indexes
  - [ ] Enabled Row Level Security (RLS)
  - [ ] Created public read policies
- [ ] Created `product-images` storage bucket
  - [ ] Set bucket to public
  - [ ] Created storage policies
  - [ ] Uploaded `placeholder.webp` image
- [ ] Copied API credentials to `.env.local`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_KEY`

### 2. Environment Variables
- [ ] `.env.local` exists and is configured
- [ ] All Supabase credentials are correct
- [ ] WhatsApp phone number is set: `+254742535339`
- [ ] `.env.local` is in `.gitignore` (security!)

### 3. Data Migration
- [ ] Verified `../live_scraped_products.json` exists
- [ ] Ran migration: `npm run migrate:products`
- [ ] Migration completed successfully
- [ ] Checked Supabase dashboard for products
- [ ] Reviewed `migration-errors.json` (if exists)

**Expected Results:**
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM products;  -- Should be ~1,400
SELECT COUNT(*) FROM categories; -- Should be 4
```

---

## Phase 2: Local Testing ✅

### 4. Development Server
- [ ] Installed dependencies: `npm install`
- [ ] Started dev server: `npm run dev`
- [ ] No console errors in terminal
- [ ] Server running on `http://localhost:3000`

### 5. Homepage Testing
- [ ] Homepage loads successfully
- [ ] Hero section displays with search bar
- [ ] 3 category cards appear
- [ ] Featured products grid shows (12 products)
- [ ] All images load correctly
- [ ] No placeholder images (unless image failed)
- [ ] Search bar is functional
- [ ] Popular search links work

### 6. Product Listing Page
- [ ] Navigate to `/products`
- [ ] Product grid displays (15 products)
- [ ] Search filter works
- [ ] Category dropdown filters correctly
- [ ] "Load More" button appears
- [ ] Clicking "Load More" loads 15 more products
- [ ] Product count updates correctly
- [ ] All product images load

### 7. Product Detail Page
- [ ] Click any product card
- [ ] Product detail page loads
- [ ] Large product image displays
- [ ] Product name, price, rating shown
- [ ] Discount badge appears (if discounted)
- [ ] "Chat on WhatsApp" button is visible
- [ ] Related products section shows
- [ ] Back button works

### 8. WhatsApp Integration
- [ ] Click "Chat on WhatsApp" button
- [ ] WhatsApp opens (or WhatsApp Web)
- [ ] Pre-filled message includes:
  - [ ] Product name
  - [ ] Product price
  - [ ] Pharmacy greeting
- [ ] Phone number is correct: +254 742 535 339
- [ ] Test on mobile device (opens WhatsApp app)

### 9. Mobile Responsiveness
- [ ] Open on mobile browser
- [ ] Header displays correctly
- [ ] Mobile menu opens/closes
- [ ] Search works on mobile
- [ ] Product grid adjusts (2 columns on mobile)
- [ ] Product detail page is readable
- [ ] WhatsApp button easy to tap (44px min)
- [ ] Footer displays correctly

### 10. Performance Check
- [ ] Images load quickly
- [ ] Page transitions are smooth
- [ ] No console errors in browser DevTools
- [ ] Search/filter is instant
- [ ] "Load More" responds quickly

---

## Phase 3: Production Deployment 🚀

### 11. Version Control
- [ ] Initialized Git repository: `git init`
- [ ] Created `.gitignore` (already done)
- [ ] Added all files: `git add .`
- [ ] Committed: `git commit -m "Initial commit"`
- [ ] Pushed to GitHub/GitLab:
  ```bash
  git remote add origin <your-repo-url>
  git push -u origin main
  ```

### 12. Vercel Deployment
- [ ] Logged into [vercel.com](https://vercel.com)
- [ ] Clicked "New Project"
- [ ] Imported GitHub repository
- [ ] Added environment variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_KEY`
  - [ ] `NEXT_PUBLIC_WHATSAPP_OWNER_PHONE`
  - [ ] `NEXT_PUBLIC_APP_URL` (e.g., https://gabriels-pharmacy.vercel.app)
- [ ] Clicked "Deploy"
- [ ] Deployment succeeded
- [ ] Visited production URL

### 13. Production Testing
- [ ] Homepage loads on production URL
- [ ] All features work (same as local testing)
- [ ] Images load from Supabase
- [ ] WhatsApp links work
- [ ] Mobile version works
- [ ] No console errors

### 14. DNS & Custom Domain (Optional)
- [ ] Purchased custom domain (e.g., gabrielspharmacy.co.ke)
- [ ] Added domain to Vercel project
- [ ] Updated DNS records
- [ ] SSL certificate issued
- [ ] Domain redirects to production site

---

## Phase 4: Post-Deployment 🎯

### 15. SEO & Analytics
- [ ] Verified meta tags in page source
- [ ] Submitted sitemap to Google Search Console
- [ ] Set up Vercel Analytics (built-in)
- [ ] Tested structured data (schema.org)

### 16. Monitoring & Maintenance
- [ ] Set up error monitoring (Sentry/Vercel)
- [ ] Monitor Supabase usage/limits
- [ ] Check migration errors periodically
- [ ] Plan for product updates

### 17. Customer Communication
- [ ] Updated business WhatsApp status
- [ ] Shared website link with customers
- [ ] Posted on social media
- [ ] Printed QR code for physical store

### 18. Documentation Review
- [ ] Reviewed README.md
- [ ] Bookmarked SUPABASE_SETUP.md
- [ ] Saved MIGRATION_GUIDE.md for reference
- [ ] Kept PROJECT_SUMMARY.md for team

---

## 🚨 Troubleshooting Checklist

If something doesn't work, check:

### Homepage Not Loading
- [ ] Check Vercel deployment logs
- [ ] Verify environment variables in Vercel
- [ ] Check Supabase project is not paused
- [ ] Confirm API keys are correct

### Products Not Showing
- [ ] Run query in Supabase: `SELECT COUNT(*) FROM products;`
- [ ] Check RLS policies are created
- [ ] Verify migration completed successfully
- [ ] Check browser console for errors

### Images Not Loading
- [ ] Verify `product-images` bucket exists
- [ ] Check bucket is set to public
- [ ] Confirm storage policies are correct
- [ ] Test placeholder image URL directly

### WhatsApp Links Not Working
- [ ] Verify phone number format: `+254742535339`
- [ ] Test on mobile device (should open app)
- [ ] Check browser allows opening external apps
- [ ] Confirm WhatsApp is installed

### Migration Failed
- [ ] Check `migration-errors.json` for details
- [ ] Verify internet connection (for image downloads)
- [ ] Confirm Supabase service key has permissions
- [ ] Check categories exist before running migration

---

## ✅ Final Verification

Before announcing to customers:

- [ ] **Homepage**: Loads perfectly
- [ ] **Products**: All 1,400+ products imported
- [ ] **Images**: Optimized and loading
- [ ] **Search**: Working on all devices
- [ ] **WhatsApp**: Links open correctly
- [ ] **Mobile**: Fully responsive
- [ ] **Speed**: Fast page loads (<3s)
- [ ] **Security**: HTTPS enabled
- [ ] **Contact**: Phone number is correct
- [ ] **Location**: "Umoja, Nairobi" displayed

---

## 🎉 Launch Day!

When everything is ✅:

1. **Announce on WhatsApp Business**
2. **Post on social media**
3. **Share with existing customers**
4. **Print QR code for store**
5. **Monitor first day traffic**
6. **Respond to customer inquiries promptly**

---

## 📞 Support Contacts

**Technical Issues:**
- Review documentation in project files
- Check Supabase dashboard for database issues
- Review Vercel logs for deployment errors

**Business Contact:**
- **WhatsApp**: +254 742 535 339
- **Location**: Umoja, Nairobi, Kenya

---

**Checklist Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Ready for Production 🚀
