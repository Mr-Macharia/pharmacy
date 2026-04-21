'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category } from '@/types/database';
import { Loader2, Search, MessageCircle, PackageSearch, X, Send } from 'lucide-react';
import { getGenericWhatsAppLink, generateWhatsAppUrl } from '@/lib/whatsapp';

// Quick filter buttons for common health needs
const COMMON_NEEDS = [
  { id: 'pain', label: '😣 Pain Relief', keywords: 'pain' },
  { id: 'cold', label: '🤧 Cold & Flu', keywords: 'cold' },
  { id: 'cough', label: '🗣️ Cough', keywords: 'cough' },
  { id: 'stomach', label: '🤢 Stomach', keywords: 'stomach' },
  { id: 'vitamins', label: '💊 Vitamins', keywords: 'vitamins' },
  { id: 'skin', label: '✨ Skin Care', keywords: 'skin' },
  { id: 'baby', label: '👶 Baby Care', keywords: 'baby' },
  { id: 'eyes', label: '👁️ Eye Care', keywords: 'eyes' },
];

const PHARMACY_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_OWNER_PHONE || '+254111258520';

interface ProductGridProps {
  initialProducts: Product[];
  categories: Category[];
  totalCount: number;
  initialLimit: number;
  initialCategory?: string;
  initialSearch?: string;
}

// ── Request Product Modal ────────────────────────────────────────────────────
function RequestProductModal({
  searchQuery,
  onClose,
}: {
  searchQuery: string;
  onClose: () => void;
}) {
  const [productName, setProductName] = useState(searchQuery);
  const [notes, setNotes] = useState('');

  const handleRequest = () => {
    const message = `Hi Chalrose Pharmaceuticals! 👋\n\nI'm looking for a product that I couldn't find on your website:\n\n*Product:* ${productName}${notes ? `\n*Additional info:* ${notes}` : ''}\n\nCould you let me know if you can source this for me?\n\nThank you!`;
    const url = generateWhatsAppUrl(PHARMACY_PHONE, message);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <PackageSearch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Request a Product</h2>
              <p className="text-xs text-text-secondary">We&apos;ll source it for you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-border transition-colors text-text-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Product Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Cetirizine 10mg, Insulin Pen..."
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Additional Details <span className="text-text-tertiary font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Brand preference, dosage, quantity needed..."
              rows={3}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            />
          </div>
        </div>

        <div className="mt-5 p-3 bg-green-50 rounded-lg border border-green-100">
          <p className="text-xs text-green-700">
            📲 Your request will be sent via WhatsApp. Our pharmacist will confirm availability within minutes.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-border/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRequest}
            disabled={!productName.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-success hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
            Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ProductGrid ─────────────────────────────────────────────────────────
export default function ProductGrid({
  initialProducts,
  categories,
  totalCount: initialTotalCount,
  initialLimit,
  initialCategory = '',
  initialSearch = '',
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (initialCategory) {
      const category = categories.find(c => c.slug === initialCategory);
      return category?.id || '';
    }
    return '';
  });
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const hasMore = offset < totalCount;

  // WhatsApp link for consultation
  const consultLink = getGenericWhatsAppLink(
    searchQuery
      ? `Hi, I'm looking for something for: ${searchQuery}. Can you help?`
      : 'Hi, I need help finding the right product. Can you assist me?'
  );

  // Debounced search function
  const performSearch = useCallback(async (searchStr: string, categoryStr: string) => {
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchStr) params.append('search', searchStr);
      if (categoryStr) params.append('category', categoryStr);
      params.append('limit', initialLimit.toString());
      params.append('offset', '0');

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts(data.products || []);
      setTotalCount(data.total || 0);
      setOffset(initialLimit);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  }, [initialLimit]);

  const searchRef = useRef(searchQuery);
  const categoryRef = useRef(selectedCategory);

  useEffect(() => {
    searchRef.current = searchQuery;
    categoryRef.current = selectedCategory;
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchRef.current, categoryRef.current);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, performSearch]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('limit', initialLimit.toString());
      params.append('offset', offset.toString());

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts((prev) => [...prev, ...(data.products || [])]);
      setOffset((prev) => prev + initialLimit);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Request Product Modal */}
      {showRequestModal && (
        <RequestProductModal
          searchQuery={searchQuery}
          onClose={() => setShowRequestModal(false)}
        />
      )}

      <div className="space-y-6">
        {/* Common Needs Quick Filters */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-border">
          <p className="text-sm font-medium text-text-secondary mb-3">🔍 What are you looking for?</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_NEEDS.map((need) => (
              <button
                key={need.id}
                onClick={() => {
                  if (selectedNeed === need.id) {
                    setSelectedNeed(null);
                    setSearchQuery('');
                  } else {
                    setSelectedNeed(need.id);
                    setSearchQuery(need.keywords);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedNeed === need.id
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border hover:border-primary hover:bg-primary/5'
                }`}
              >
                {need.label}
              </button>
            ))}
          </div>
          {selectedNeed && (
            <p className="text-xs text-text-tertiary mt-2">
              Showing products for: {COMMON_NEEDS.find(n => n.id === selectedNeed)?.label.slice(2)}
              <button onClick={() => { setSelectedNeed(null); setSearchQuery(''); }} className="ml-2 text-primary hover:underline">Clear</button>
            </p>
          )}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedNeed(null); }}
              placeholder="Try: headache, vitamin C, cough syrup..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        {searchLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface rounded-xl">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              {searchQuery || selectedCategory
                ? "We couldn't find what you're looking for"
                : 'No products available'}
            </h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory
                ? "Don't worry! You can request the product or ask our pharmacist for help."
                : 'Please check back later or contact us for assistance.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* Request Unavailable Product */}
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors"
                >
                  <PackageSearch className="w-5 h-5" />
                  Request This Product
                </button>
              )}
              {/* Ask Pharmacist */}
              <a
                href={consultLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-success hover:bg-success/90 text-white font-bold rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Ask Our Pharmacist
              </a>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedNeed(null); setSelectedCategory(''); }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-border hover:bg-surface text-text-primary font-bold rounded-lg transition-colors"
                >
                  Browse All Products
                </button>
              )}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !searchLoading && (
          <div className="flex justify-center pt-6">
            <button
              onClick={loadMore}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                `Load More Products`
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
