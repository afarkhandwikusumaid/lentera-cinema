'use client';
import React, { useEffect, useState } from 'react';
import { TOOLS } from './data';
import { getSettings, SiteSettings } from '@/lib/db';

export default function Hero() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);
  return (
    <section className="relative min-h-[95dvh] flex flex-col justify-center items-center bg-[#000] overflow-hidden text-center px-4">
      {/* Background Image/Video */}
      <div className="absolute inset-0 w-full h-full">
        {settings?.hero_video_url && !videoError ? (
          <video 
            src={settings.hero_video_url} 
            autoPlay muted loop playsInline 
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover opacity-[0.35]" 
          />
        ) : (
          <img src="/images/video_wisuda.png" alt="Background" className="w-full h-full object-cover opacity-[0.35]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center pt-28 md:pt-24">
        <h1 className="font-serif font-medium text-white mb-6 fade-up" style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5rem)', lineHeight: '1.05', letterSpacing: '-0.015em' }}>
          {settings?.hero_title || 'Abadikan momen yang tak terlupakan'}
        </h1>
        <p className="text-white/70 text-sm sm:text-base max-w-2xl font-medium mb-10 fade-up" style={{ animationDelay: '0.1s', lineHeight: '1.6' }}>
          {settings?.hero_subtitle || 'Ekosistem kreatif terlengkap — video sinematik, foto eksklusif, yearbook premium, dan dokumentasi event berkelas. Pilihan dipercaya klien se-Indonesia.'}
        </p>
        
        <div className="fade-up" style={{ animationDelay: '0.2s' }}>
          <a href="https://wa.me/6285944629716?text=Halo%20Lentera%20Cinema,%20saya%20ingin%20konsultasi%20mengenai%20pembuatan%20video%20atau%20dokumentasi." target="_blank" rel="noreferrer" 
             className="glow-btn inline-block px-10 py-3.5 rounded-full text-base font-bold tracking-wide">
            Konsultasi Sekarang
          </a>
        </div>
      </div>

      {/* Artlist-style AI Toolkit Box at bottom of Hero */}
      <div className="relative z-20 fade-up mt-12 mb-10 px-4 w-full" style={{ animationDelay: '0.3s' }}>
        <p className="text-white/60 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto mb-6 text-center">
          Ekosistem dokumentasi terlengkap — Foto, Video, Drone, dan Livestream. Pilihan terbaik untuk mengabadikan momen Anda.
        </p>
        <div className="glass rounded-[24px] md:rounded-full p-5 md:px-8 md:py-4 flex flex-wrap md:flex-nowrap items-center justify-center gap-3 w-fit mx-auto border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl">
          {TOOLS.map((tool, i) => (
            <div key={i} 
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 md:px-5 py-2 md:py-2.5 shrink-0">
              <span className="text-white/80 scale-90">{tool.icon}</span>
              <span className="text-xs md:text-sm font-semibold text-white tracking-wide whitespace-nowrap">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
