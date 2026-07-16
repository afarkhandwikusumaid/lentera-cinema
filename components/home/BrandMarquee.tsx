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
      {/* Gradients for smooth fade on edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <div className="w-full relative flex items-center">
        <div className="flex w-max animate-marquee space-x-16 md:space-x-24 px-8">
          {/* Using 2 loops for continuous 50% translation effect */}
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center justify-center opacity-40 hover:opacity-100 transition-all duration-300 filter grayscale hover:grayscale-0 brightness-0 invert hover:brightness-100 hover:invert-0 cursor-pointer">
              <img 
                src={brand.src} 
                alt={brand.name} 
                loading="lazy"
                decoding="async"
                width={100} 
                height={50} 
                className="h-[30px] md:h-9 mix-blend-screen w-auto object-contain flex-shrink-0"
                style={{ color: 'transparent' }} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
