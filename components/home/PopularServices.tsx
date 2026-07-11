'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getServices, Service } from '@/lib/db';

export default function PopularServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [hoverApp, setHoverApp] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getServices().then(data => setServices(data.filter(s => s.is_active)));
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-24 bg-black">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-xl">
            <h2 className="font-serif font-medium text-white mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.01em', lineHeight: '1.1' }}>
              Layanan Populer
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              Ubah momen berharga Anda menjadi mahakarya visual dengan layanan eksklusif kami.
            </p>
          </div>
        </div>

        {/* Horizontal scrollable carousel wrapper */}
        <div className="relative group/carousel">
          
          {/* Left navigation arrow */}
          <button 
            onClick={() => scroll('left')} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black text-white rounded-full p-3.5 backdrop-blur-md border border-white/10 shadow-2xl cursor-pointer transition-all duration-300 active:scale-90 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Carousel container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-6 px-2 md:px-0"
          >
            {services.map((card, i) => (
              <div key={card.id}
                className="relative rounded-[24px] overflow-hidden aspect-[4/3] bg-[#0f0f0f] cursor-pointer group border border-white/5 w-[300px] sm:w-[380px] md:w-[420px] shrink-0 snap-start select-none"
                onClick={() => window.location.href = `/layanan/${card.slug}`}
                onMouseEnter={() => {
                  setHoverApp(i);
                  videoRefs.current[i]?.play().catch(() => {});
                }}
                onMouseLeave={() => {
                  setHoverApp(null);
                  const v = videoRefs.current[i];
                  if (v) { v.pause(); v.currentTime = 0; }
                }}>
                <img src={card.image_url || '/images/yearbook.png'} alt={card.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {card.video_url && (
                  <video ref={el => { videoRefs.current[i] = el; }} src={card.video_url} loop muted playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hoverApp === i ? 'opacity-100' : 'opacity-0'}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                
                {/* Pill Top Left (Artlist style) */}
                {(i === 0 || i === 2 || i === 4) && (
                  <div className="absolute top-5 left-5">
                    <span className="text-[9px] font-bold text-black bg-[#e8b84b] px-2.5 py-1 rounded-[6px] uppercase tracking-wider">POPULER</span>
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end z-20">
                  <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight leading-none">{card.name}</h3>
                  <p className="text-[13px] text-white/70 leading-relaxed font-normal line-clamp-2">{card.description}</p>
                  
                  {/* Artlist-style inline button (appears on hover) */}
                  <div className="mt-0 overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-[50px] group-hover:opacity-100 group-hover:mt-4">
                    <a href={`/layanan/${card.slug}`} className="inline-flex items-center justify-center bg-white text-black font-semibold text-[13px] px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors" onClick={(e) => e.stopPropagation()}>
                      Lihat Detail
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right navigation arrow */}
          <button 
            onClick={() => scroll('right')} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black text-white rounded-full p-3.5 backdrop-blur-md border border-white/10 shadow-2xl cursor-pointer transition-all duration-300 active:scale-90 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

        </div>
      </div>
    </section>
  );
}
