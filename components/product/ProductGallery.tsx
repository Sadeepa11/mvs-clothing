'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const imageList = images.length > 0 ? images : ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop'];
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails list */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar max-h-[600px]">
        {imageList.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative w-20 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden border-2 transition-all ${
              selectedIndex === index ? 'border-[#111827] shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={img}
              alt={`${title} preview ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden border border-gray-200 shadow-sm">
        <Image
          src={imageList[selectedIndex]}
          alt={title}
          fill
          priority
          className="object-cover object-center transition-all duration-500"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
