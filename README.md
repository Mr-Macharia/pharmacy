# Gabriel's Pharmacy - Modern E-Pharmacy Platform

A modern, WhatsApp-first pharmacy e-commerce platform built with Next.js 14, TypeScript, TailwindCSS, and Supabase. Designed for Gabriel's Pharmacy in Umoja, Nairobi, Kenya.

![Gabriel's Pharmacy](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)

## 🌟 Features

- **📱 WhatsApp-First Communication**: Direct consultation with licensed pharmacists
- **🔍 Smart Product Search**: Client-side filtering with fuzzy search capabilities
- **📦 1,400+ Products**: Auto-categorized medications, vitamins, and health essentials
- **🎨 Modern UI**: Gabriel's custom design system with cream/blue/teal palette
- **🌙 Dark Mode Support**: Automatic theme switching
- **⚡ Fast Performance**: Next.js 14 App Router with server-side rendering
- **📱 Mobile-First**: Responsive design optimized for mobile devices
- **💰 Discount Badges**: Dynamic pricing with original/discounted prices
- **⭐ Product Ratings**: Star ratings and review counts
- **🔄 Load More Pagination**: Smooth product loading (15 products per page)
- **🖼️ Optimized Images**: WebP compression with Sharp (85% quality, 800x800)
- **🔒 Type-Safe**: Full TypeScript coverage with strict mode

## 🏗️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Storage**: Supabase Storage (product images)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/)
- **Deployment**: [Vercel](https://vercel.com/) (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([sign up free](https://supabase.com))
- The scraped product data (`live_scraped_products.json`)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase** (IMPORTANT):
   - Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Create your Supabase project
   - Run the SQL migrations to create tables
   - Create the `product-images` storage bucket
   - Upload a `placeholder.webp` image

3. **Configure environment variables**:
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   NEXT_PUBLIC_WHATSAPP_OWNER_PHONE=+254743490973
   ```

4. **Run the migration** (imports products from JSON):
   ```bash
   npm run migrate:products
   ```
   
   This will:
   - Parse all 1,400+ products from `../live_scraped_products.json`
   - Auto-categorize products (Prescriptions, OTC Meds, Health Essentials)
   - Download and optimize images (WebP, 800x800, 85% quality)
   - Upload to Supabase Storage
   - Insert product records to database
   - Takes ~25-35 minutes
   
   See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for details.

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   ```
   http://localhost:3000
   ```

## 🎨 Design System

### Colors

```css
Primary Blue: #1F67D1
Secondary Teal: #1F756B
Accent Orange: #E67F54
Success Green: #16C784
Warning Yellow: #F9A825
Error Red: #D9524D
Cream Background: #FFFBF5
Charcoal Text: #1F2121
```

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold, tight tracking
- **Body**: Regular, 1.5 line height

## 📱 Key Features

### WhatsApp Integration

All product inquiries go through WhatsApp instead of traditional cart/checkout:

```typescript
// Generates pre-filled WhatsApp messages
const whatsappLink = getProductWhatsAppLink({
  productId: product.id,
  productName: product.name,
  price: product.price,
});
// Opens: https://wa.me/254743490973?text=Hi%20Gabriel's%20Pharmacy...
```

### Auto-Categorization

Products are automatically categorized using keyword matching:

- **Prescriptions**: prescription, rx, prescribed
- **OTC Meds**: pain, relief, cold, flu, allergy, fever
- **Health Essentials**: vitamin, supplement, multivitamin
- **General**: Everything else

### Load More Pagination

- Initial page load: 15 products (server-side)
- Click "Load More": Fetch next 15 products (client-side)
- Client-side search/filter on already-loaded products
- No re-fetching during filter changes

## 🔧 Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Data Migration
npm run migrate:products  # Import products from JSON

# Linting
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Products Not Showing

- **Check Supabase**: Verify products exist: `SELECT COUNT(*) FROM products;`
- **Check API**: Visit `http://localhost:3000/api/products`
- **Check env vars**: Ensure `NEXT_PUBLIC_SUPABASE_URL` is correct

### Images Not Loading

- **Check Storage**: Verify `product-images` bucket exists in Supabase
- **Check RLS**: Ensure storage bucket has public read policy
- **Check placeholder**: Upload `placeholder.webp` to `product-images/`

### Migration Errors

- **Check `migration-errors.json`** for detailed errors
- **Common issues**: 
  - Invalid image URLs (network issues)
  - Duplicate slugs (re-running migration)
  - Missing categories (run category insert SQL first)

### WhatsApp Links Not Working

- **Mobile**: Should open WhatsApp app directly
- **Desktop**: Opens WhatsApp Web
- **Format**: Ensure phone is `+254743490973` (E.164 format)

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Deploy!

3. **Post-Deployment**:
   - Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
   - Verify WhatsApp links work on mobile
   - Test product images load correctly

## 📁 Project Structure

```
gabriels-pharmacy/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/products/      # API routes
│   │   ├── products/          # Product pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── home/              # Homepage sections
│   │   ├── layout/            # Header, Footer
│   │   └── products/          # Product components
│   ├── lib/                   # Utilities
│   └── types/                 # TypeScript types
├── scripts/
│   └── migrate-products.ts    # Data migration
├── SUPABASE_SETUP.md          # Setup guide
├── MIGRATION_GUIDE.md         # Migration docs
└── package.json
```

## 📧 Contact

**Gabriel's Pharmacy**
- **Location**: Umoja, Nairobi, Kenya
- **WhatsApp**: +254 743 490 973
- **Hours**: Available 24/7

---

**Built with ❤️ for Gabriel's Pharmacy**

*Last Updated: January 2026*
