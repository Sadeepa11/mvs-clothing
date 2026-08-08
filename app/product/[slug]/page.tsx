import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import ProductGallery from '@/components/product/ProductGallery';
import VariantSelector from '@/components/product/VariantSelector';
import ProductDetails from '@/components/product/ProductDetails';
import ProductCard from '@/components/product/ProductCard';
import { getProductBySlug, getProducts } from '@/lib/actions';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const res = await getProductBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const product = res.data;

  // Parse images
  let imageList: string[] = [];
  try {
    imageList = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch {
    imageList = [product.images as string];
  }

  // Fetch related products from same category
  const relatedRes = await getProducts({ category: product.category });
  const relatedProducts = (relatedRes.data || [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link href="/catalog" className="hover:text-black">Catalog</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link href={`/catalog?category=${product.category}`} className="hover:text-black">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Multi-Image Gallery */}
        <ProductGallery images={imageList} title={product.title} />

        {/* Right: Variant Selector & Accordion Details */}
        <div className="space-y-8">
          <VariantSelector product={product as any} />
          <ProductDetails description={product.description} details={product.details} />
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-gray-200 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
                Complementary Wardrobe
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111827] mt-1">
                You May Also Covet
              </h2>
            </div>
            <Link
              href={`/catalog?category=${product.category}`}
              className="text-xs font-bold uppercase tracking-widest text-[#111827] hover:text-[#C5A880]"
            >
              Explore {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
