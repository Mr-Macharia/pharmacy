'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const popularSearches = [
    { label: 'Vitamins', slug: 'vitamin' },
    { label: 'Pain Relief', slug: 'pain' },
    { label: 'Cold & Flu', slug: 'cold' },
  ];

  return (
    <div className="px-4 md:px-10 lg:px-40 py-10">
      <div className="max-w-[960px] mx-auto">
        <div className="flex flex-col-reverse md:flex-row gap-8 items-center">
          {/* Left Content */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-text-primary text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Your Health,
                <br />
                Delivered Safely.
              </h1>
              <p className="text-text-secondary text-base leading-relaxed max-w-lg">
                Consult with licensed pharmacists and get your prescriptions delivered directly to your door in Umoja, Nairobi. Same-day delivery available.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-[480px]">
              <div className="flex w-full items-stretch rounded-xl h-14 shadow-sm ring-1 ring-border hover:ring-primary focus-within:ring-2 focus-within:ring-primary transition-all bg-surface">
                <div className="flex items-center justify-center pl-4 text-text-secondary">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-3 text-base placeholder:text-text-tertiary"
                  placeholder="Search medications, symptoms..."
                />
                <div className="flex items-center justify-center pr-2">
                  <button
                    type="submit"
                    className="flex items-center justify-center px-5 h-10 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Popular Searches */}
              <div className="flex items-center gap-3 mt-3 ml-1 text-xs text-text-secondary flex-wrap">
                <span>Popular:</span>
                {popularSearches.map((search) => (
                  <a
                    key={search.slug}
                    href={`/products?search=${search.slug}`}
                    className="underline hover:text-primary transition-colors"
                  >
                    {search.label}
                  </a>
                ))}
              </div>
            </form>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden relative shadow-lg">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop")',
              }}
            />

            {/* Floating Badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-auto bg-white/95 backdrop-blur-md p-3 rounded-xl flex items-center gap-3 shadow-lg border border-white/20">
              <div className="bg-success/20 text-success p-2 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-text-primary">Licensed Pharmacists</p>
                <p className="text-[10px] text-text-secondary">Available 24/7 for consultation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
