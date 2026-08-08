'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, RefreshCw, Truck } from 'lucide-react';

interface ProductDetailsProps {
  description: string;
  details?: string | null; // JSON object with fabric, care, shipping
}

export default function ProductDetails({ description, details }: ProductDetailsProps) {
  let parsedDetails: { fabric?: string; care?: string; shipping?: string } = {};

  try {
    if (details) parsedDetails = JSON.parse(details);
  } catch {
    parsedDetails = {
      fabric: 'Premium natural fibers sourced from master Italian mills.',
      care: 'Dry clean recommended to maintain structure and garment longevity.',
      shipping: 'Complimentary signature delivery on all orders.',
    };
  }

  const [openSection, setOpenSection] = useState<string | null>('description');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const accordionItems = [
    {
      id: 'description',
      title: 'Garment Overview & Design',
      icon: <Sparkles className="w-4 h-4 text-[#C5A880]" />,
      content: description,
    },
    {
      id: 'fabric',
      title: 'Fabric & Composition',
      icon: <Sparkles className="w-4 h-4 text-[#C5A880]" />,
      content: parsedDetails.fabric || '100% Premium Natural Fibers.',
    },
    {
      id: 'care',
      title: 'Garment Care Instructions',
      icon: <RefreshCw className="w-4 h-4 text-[#C5A880]" />,
      content: parsedDetails.care || 'Specialist dry clean only. Store on wide wooden hanger.',
    },
    {
      id: 'shipping',
      title: 'Complimentary Shipping & Returns',
      icon: <Truck className="w-4 h-4 text-[#C5A880]" />,
      content: parsedDetails.shipping || 'Complimentary express shipping on orders over $250. 30-day return window.',
    },
  ];

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200">
      <h3 className="text-xs uppercase tracking-widest font-bold text-[#111827]">
        Product Specifications
      </h3>

      <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
        {accordionItems.map((item) => (
          <div key={item.id} className="py-3">
            <button
              onClick={() => toggleSection(item.id)}
              className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-gray-900 hover:text-[#C5A880] transition-colors py-1 text-left"
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  openSection === item.id ? 'transform rotate-180 text-[#C5A880]' : 'text-gray-400'
                }`}
              />
            </button>

            {openSection === item.id && (
              <div className="pt-3 pb-1 text-xs text-gray-600 leading-relaxed font-normal animate-fadeIn">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
