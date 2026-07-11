'use client';
import React, { useState, useEffect } from 'react';
import { getBrands, Brand } from '@/lib/db';

const KitbLogo = () => (
  <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[30px] md:h-9 mix-blend-screen w-auto object-contain flex-shrink-0">
    <rect x="0" y="5" width="30" height="30" rx="4" fill="currentColor"/>
    <path d="M8 12L15 28L22 12" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="38" y="27" fill="currentColor" fontSize="22" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">KITB</text>
  </svg>
);

const STATIC_LOGOS = [
  { name: 'Pertamina', src: '/brands/pertamina.png' },
  { name: 'KAI', src: '/brands/kai.svg' },
  { name: 'Bank Mandiri', src: '/brands/mandiri.svg' },
  { name: 'Telkomsel', src: '/brands/telkomsel.svg' },
  { name: 'BCA', src: '/brands/bca.svg' },
  { name: 'AQUA', src: '/brands/aqua.svg' },
  { name: 'WIKA', src: '/brands/wika.svg' },
  { name: 'Gojek', src: '/brands/gojek.svg' },
  { name: 'Tokopedia', src: '/brands/tokopedia.svg' },
  { name: 'KITB', isComponent: true },
];

export default function BrandMarquee() {
  const [brands, setBrands] = useState<{name: string, src?: string, isComponent?: boolean}[]>(STATIC_LOGOS);

  useEffect(() => {
    async function loadBrands() {
      const dbBrands = await getBrands();
      const activeBrands = dbBrands.filter(b => b.is_active);
      if (activeBrands.length > 0) {
        setBrands(activeBrands.map(b => ({
          name: b.name,
          src: b.logo_url
        })));
      }
    }
    loadBrands();
  }, []);

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
              {brand.isComponent ? (
                <div className="text-white hover:text-[#0056A4]"><KitbLogo /></div>
              ) : (
                <img 
                  src={brand.src as string} 
                  alt={brand.name} 
                  loading="lazy"
                  decoding="async"
                  width={100} 
                  height={50} 
                  className="h-[30px] md:h-9 mix-blend-screen w-auto object-contain flex-shrink-0"
                  style={{ color: 'transparent' }} 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
