'use client';
import React, { useState, useEffect } from 'react';
import { getBrands } from '@/lib/db';

export default function BrandMarquee() {
  const [brands, setBrands] = useState<{name: string, src: string}[]>([]);

  useEffect(() => {
    async function loadBrands() {
      const dbBrands = await getBrands();
      const activeBrands = dbBrands.filter(b => b.is_active);
      setBrands(activeBrands.map(b => ({
        name: b.name,
        src: b.logo_url
      })));
    }
    loadBrands();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="bg-black border-y border-[#2a2a2a] py-8 overflow-hidden relative flex flex-col items-center">
      <h3 className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-8">Kemitraan Kami</h3>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {brands.map((brand, i) => (
            <div key={i} className="flex items-center justify-center opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300">
              <img 
                src={brand.src} 
                alt={brand.name} 
                loading="lazy"
                decoding="async"
                width={100} 
                height={50} 
                className="h-[30px] md:h-10 w-auto object-contain flex-shrink-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
