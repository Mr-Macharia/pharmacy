import { getProductBySlug, getRelatedProducts } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, Shield } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/supabase';
import { getProductWhatsAppLink } from '@/lib/whatsapp';
import ProductCard from '@/components/products/ProductCard';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const imageUrl = getProductImageUrl(product.image_url);
  const hasDiscount = product.original_price && product.original_price > product.price;

  const whatsappLink = getProductWhatsAppLink({
    productId: product.id,
    productName: product.name,
    price: product.price,
    currency: product.currency,
  });

  // Fetch related products
  const relatedProducts = product.category_id
    ? await getRelatedProducts(product.category_id, product.id, 4)
    : [];

  return (
    <div className="px-4 md:px-10 lg:px-40 py-10">
      <div className="max-w-[1200px] mx-auto">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image */}
          <div className="relative aspect-square bg-border-light rounded-2xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                {product.discount_percentage}% OFF
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-lg font-bold">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {/* Category */}
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm text-primary hover:underline w-fit"
              >
                {product.category.name}
              </Link>
            )}

            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-3">
                {product.name}
              </h1>

            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-text-primary">
                {formatPrice(product.price, product.currency)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-text-tertiary line-through">
                  {formatPrice(product.original_price!, product.currency)}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3 py-4 border-y border-border">
              {product.unit_quantity && (
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-5 h-5 text-text-secondary" />
                  <span className="text-text-secondary">Quantity:</span>
                  <span className="font-medium text-text-primary">{product.unit_quantity}</span>
                </div>
              )}

              {product.requires_prescription && (
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-5 h-5 text-warning" />
                  <span className="text-warning font-medium">Prescription Required</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-secondary">Stock:</span>
                <span
                  className={`font-medium ${
                    product.in_stock ? 'text-success' : 'text-error'
                  }`}
                >
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-2">
                  Description
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col gap-3 pt-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-success hover:bg-success/90 text-white font-bold rounded-lg transition-colors text-center"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Chat on WhatsApp to Order
              </a>

              <p className="text-xs text-text-tertiary text-center">
                Connect with our pharmacist to confirm availability and delivery
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
