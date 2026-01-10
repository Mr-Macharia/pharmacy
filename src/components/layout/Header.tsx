'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Phone } from 'lucide-react';
import { useState } from 'react';
import { getGenericWhatsAppLink } from '@/lib/whatsapp';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const whatsappLink = getGenericWhatsAppLink();

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="mx-auto px-4 lg:px-10">
        <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">
          {/* Logo & Nav */}
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-text-primary">
              <div className="w-8 h-8 flex items-center justify-center text-primary">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 9h-1.42l-3.712-6.496-1.736.992L17.277 9H6.723l3.145-5.504-1.736-.992L4.42 9H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1zM16 11v2h-3v3h-2v-3H8v-2h3V8h2v3h3z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-tight hidden sm:block">
                Gabriel&apos;s Pharmacy
              </h2>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/products"
                className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
              >
                Pharmacy
              </Link>
              <Link
                href="/products?category=health-essentials"
                className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
              >
                Wellness
              </Link>
              <Link
                href="/services"
                className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
              >
                Services
              </Link>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex flex-1 justify-end gap-3 items-center">
            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex flex-col min-w-40 max-w-64"
            >
              <div className="flex w-full items-stretch rounded-lg h-10 ring-1 ring-border hover:ring-primary focus-within:ring-2 focus-within:ring-primary transition-all">
                <div className="flex items-center justify-center pl-3 text-text-secondary">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-3 text-sm placeholder:text-text-tertiary"
                  placeholder="Search products"
                />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Consult Pharmacist (Desktop) */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center justify-center px-4 h-10 bg-primary hover:bg-primary-dark transition-colors text-white text-sm font-bold rounded-lg"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>Consult</span>
              </a>

              {/* Mobile Search */}
              <button
                onClick={() => {
                  const search = prompt('Search products:');
                  if (search) {
                    window.location.href = `/products?search=${encodeURIComponent(search)}`;
                  }
                }}
                className="lg:hidden flex items-center justify-center w-10 h-10 bg-border hover:bg-border-light rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-text-primary" />
              </button>

              {/* WhatsApp Cart */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-border hover:bg-border-light rounded-lg transition-colors relative"
                title="Chat on WhatsApp"
              >
                <ShoppingCart className="w-5 h-5 text-text-primary" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-success rounded-full"></span>
              </a>

              {/* User Icon */}
              <button className="flex items-center justify-center w-10 h-10 bg-border hover:bg-border-light rounded-lg transition-colors">
                <User className="w-5 h-5 text-text-primary" />
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 bg-border hover:bg-border-light rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-3">
              <Link
                href="/products"
                className="px-3 py-2 text-sm font-medium text-text-primary hover:bg-border rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pharmacy
              </Link>
              <Link
                href="/products?category=health-essentials"
                className="px-3 py-2 text-sm font-medium text-text-primary hover:bg-border rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Wellness
              </Link>
              <Link
                href="/services"
                className="px-3 py-2 text-sm font-medium text-text-primary hover:bg-border rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors text-center"
              >
                Consult Pharmacist
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
