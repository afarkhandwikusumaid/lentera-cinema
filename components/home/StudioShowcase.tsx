'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AI_ICONS } from './data';

export default function StudioShowcase() {
  return (
    <section className="pt-24 pb-16 bg-[#000]">
      {/* Toolkit Header (Artlist Style) */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-16">
        <h2 className="font-serif font-medium text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: '1.1' }}>
          Studio Dokumentasi
        </h2>
        <p className="text-white/60 text-sm sm:text-base max-w-lg mx-auto font-medium">
          Ekosistem dokumentasi terlengkap untuk mengabadikan momen penting Anda secara teratur dan sinematik.
        </p>
      </div>

      {/* Go to Toolkit Button */}
      <div className="flex justify-center mb-16">
        <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" 
           className="glow-btn px-8 py-3.5 rounded-full text-[14px] font-bold uppercase tracking-wider transition-all duration-300">
          Mulai Konsultasi
        </a>
      </div>

      <div className="relative flex flex-col items-center">
        
        {/* CARDS (Z-10) overlapping the image below */}
        <div className="relative z-10 w-full max-w-[1200px] px-6 mx-auto flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory pb-8 lg:pb-0 no-scrollbar items-stretch">
          {[
            { slug: 'yearbook', icon: AI_ICONS.Music, t: 'Yearbook Premium', d: 'Buku kenangan sekolah dengan material cetak eksklusif dan drone b-roll.' },
            { slug: 'wisuda', icon: AI_ICONS.Image, t: 'Dokumentasi Wisuda', d: 'Sesi foto dan video wisuda beresolusi tinggi dengan lighting profesional.' },
            { slug: 'wedding', icon: AI_ICONS.Voice, t: 'Wedding Organizer', d: 'Liputan lengkap akad dan resepsi dengan highlight film sinematik mewah.' },
            { slug: 'foto-event', icon: AI_ICONS.Video, t: 'Dokumentasi Event', d: 'Dokumentasi acara formal maupun non-formal dengan konsep visual estetik.' },
          ].map((tool, i) => (
            <div key={i} 
              className="glass rounded-[24px] p-6 flex flex-col hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden group border border-white/5 shadow-2xl min-w-[280px] w-[85vw] md:w-auto shrink-0 snap-center">
              <div className="mb-6 text-white/90 scale-100 group-hover:scale-105 transition-transform duration-300">{tool.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-[#e8b84b] transition-colors">{tool.t}</h3>
              <p className="text-[13px] text-white/50 leading-relaxed flex-1 mb-10">
                {tool.d}
              </p>
              <div className="flex items-center justify-between mt-auto gap-2">
                <a href={`/layanan/${tool.slug}`} className="text-[13px] text-white/80 hover:text-white font-semibold transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white">
                  Selengkapnya
                </a>
                <a href="https://wa.me/6285944629716" target="_blank" rel="noreferrer" 
                   className="px-5 py-2.5 rounded-full bg-gradient-to-r from-white to-white/90 text-black text-[12px] font-bold hover:from-white/95 hover:to-white/85 shadow-lg active:scale-95 transition-all duration-200">
                  Pesan
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* LARGE SHOWCASE IMAGE (Z-0) */}
        {/* Negative margin pulls the image up behind the cards */}
        <div className="w-full max-w-[1400px] mx-auto px-6 -mt-20 md:-mt-28 relative z-0">
          <div className="rounded-[32px] overflow-hidden relative aspect-[4/3] md:aspect-[21/9] bg-[#0f0f0f] border border-white/5 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.8)]">
            <img src="/images/graduation.png" alt="Showcase" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            
            {/* Top gradient to blend with the black background above */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/40 to-transparent" />
            
            {/* Bottom gradient */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            {/* Fake input at bottom center */}
            <div className="absolute bottom-8 inset-x-0 flex justify-center">
              <a href="https://wa.me/6285944629716" target="_blank" rel="noreferrer" className="bg-black/35 backdrop-blur-md rounded-full px-6 py-3 flex items-center justify-between gap-10 border border-white/10 w-full max-w-md group cursor-pointer hover:bg-black/50 transition-colors">
                <span className="text-[13px] text-white/50 group-hover:text-white/80 transition-colors">Ceritakan konsep dokumentasi impian Anda...</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
