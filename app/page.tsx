import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, RefreshCw, Award } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/lib/actions';

export const revalidate = 60; // revalidate page every 60 seconds

export default async function HomePage() {
  const result = await getProducts({ featured: true });
  const featuredProducts = result.data || [];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Banner Section */}
      <section className="relative w-full min-h-[85vh] bg-[#111827] text-white flex items-center justify-center overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="MVS Clothing Luxury Lookbook"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
            <Sparkles className="w-3.5 h-3.5" /> Autumn / Winter '26 Collection
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight uppercase text-white leading-tight">
            Architectural <br />
            <span className="font-bold text-[#C5A880] italic">Minimalism</span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-300 font-light leading-relaxed">
            immaculately tailored silhouettes constructed from pure Italian wool, organic heavy silk, and Mongolian cashmere.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/catalog"
              className="w-full sm:w-auto px-8 py-4 bg-[#C5A880] text-[#111827] text-xs uppercase tracking-widest font-bold rounded hover:bg-[#b3946b] transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              Shop New Arrivals <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/catalog?category=Men"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white text-xs uppercase tracking-widest font-semibold rounded border border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-white rounded-lg border border-gray-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#111827] text-[#C5A880] rounded-full">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Italian Mills</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Custom woven fabrics from Biella & Florence</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#111827] text-[#C5A880] rounded-full">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Complimentary Shipping</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Free express courier on orders $250+</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#111827] text-[#C5A880] rounded-full">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">30-Day Returns</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Seamless doorstep collection policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#111827] text-[#C5A880] rounded-full">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Limited Production</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Numbered small batch artisanal runs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">Curated Selection</span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111827] mt-1">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/catalog"
            className="mt-2 md:mt-0 text-xs font-bold uppercase tracking-widest text-[#111827] hover:text-[#C5A880] transition-colors flex items-center gap-1.5"
          >
            View Full Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Category Spotlight Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">Explore Departments</span>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111827]">
            Shop By Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Men */}
          <Link href="/catalog?category=Men" className="group relative h-96 rounded-sm overflow-hidden border border-gray-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop"
              alt="Men's Tailoring"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">Tailored Collection</span>
              <h3 className="text-xl font-bold uppercase tracking-wider">Men's Outerwear</h3>
              <span className="text-xs text-gray-300 group-hover:underline flex items-center gap-1">
                Shop Men <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Women */}
          <Link href="/catalog?category=Women" className="group relative h-96 rounded-sm overflow-hidden border border-gray-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
              alt="Women's Apparel"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">Fluid Elegance</span>
              <h3 className="text-xl font-bold uppercase tracking-wider">Women's Silhouette</h3>
              <span className="text-xs text-gray-300 group-hover:underline flex items-center gap-1">
                Shop Women <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Accessories */}
          <Link href="/catalog?category=Accessories" className="group relative h-96 rounded-sm overflow-hidden border border-gray-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop"
              alt="Accessories"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">Fine Leather Goods</span>
              <h3 className="text-xl font-bold uppercase tracking-wider">Accessories & Bags</h3>
              <span className="text-xs text-gray-300 group-hover:underline flex items-center gap-1">
                Shop Accessories <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
