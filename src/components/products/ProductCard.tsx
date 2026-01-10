'use client';

import { Plus, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/database';
import { formatPrice } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/supabase';
import { getProductWhatsAppLink } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product.image_url);
  const whatsappLink = getProductWhatsAppLink({
    productId: product.id,
    productName: product.name,
    price: product.price,
    currency: product.currency,
  });

  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <div className="flex flex-col gap-3 bg-surface p-4 rounded-xl border border-border hover:shadow-lg transition-all group">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative w-full aspect-square bg-border-light rounded-lg overflow-hidden block">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            {product.discount_percentage}% OFF
          </div>
        )}

        {/* Stock Badge */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-bold">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Quick Add Button - Outside the Link to avoid nested anchors */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-[calc(1rem+8px)] right-[calc(1rem+8px)] w-8 h-8 bg-surface rounded-full shadow-md flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Plus className="w-4 h-4" />
      </a>

      {/* Product Info */}
      <div className="flex flex-col gap-1">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
          <span className="text-xs font-medium text-text-primary">{product.rating.toFixed(1)}</span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-text-primary text-sm font-bold leading-tight line-clamp-2 min-h-[2.5em] hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Dosage/Quantity */}
        {product.unit_quantity && (
          <p className="text-text-tertiary text-xs">{product.unit_quantity}</p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-text-primary font-bold">
              {formatPrice(product.price, product.currency)}
            </span>
            {hasDiscount && (
              <span className="text-text-tertiary text-xs line-through">
                {formatPrice(product.original_price!, product.currency)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
