'use client';
import { notFound } from 'next/navigation';
import Nav from '@/components/PublicNav';
import Footer from '@/components/PublicFooter';
import React, { useEffect, useState } from 'react';
import { getServices, Service } from '@/lib/db';
import { ArrowRight, Play } from 'lucide-react';

export default function GenericPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getServices().then(data => {
      const found = data.find(s => s.slug === unwrappedParams.slug);
      setService(found || null);
      setLoading(false);
    });
  }, [unwrappedParams.slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;

  if (!service) {
    return notFound();
  }

  const title = service.name;

  return (
    <>
      <Nav />
      {/* ── HERO ── */}
      <section className="pt-32 pb-20 bg-black border-b border-[#2a2a2a] relative overflow-hidden min-h-[60vh] flex flex-col justify-center">
        <div className="absolute inset-0 w-full h-full">
          <img src={service.image_url || '/images/yearbook.png'} className="w-full h-full object-cover opacity-30 blur-sm" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>
        <div className="mx-auto max-w-5xl px-6 relative z-10 text-center">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#e8b84b] mb-4 block">{service.subtitle || 'Layanan Kami'}</span>
          <h1 className="text-white mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: '1' }}>{title}</h1>
          <p className="text-[#888] max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-10">
            {service.description}
          </p>
          <a href="https://wa.me/6285944629716?text=Halo%20Lentera%20Cinema,%20saya%20tertarik%20untuk%20konsultasi%20layanan%20dokumentasi." target="_blank" rel="noreferrer" 
             className="glow-btn px-8 py-3 rounded-full text-sm font-bold tracking-wide inline-flex items-center gap-2">
            Konsultasi Sekarang <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── TAGLINE SECTION ── */}
      <section className="py-24 bg-[#111]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[#e8b84b] italic mb-6">
            "Merekam Emosi, Mengabadikan Momen"
          </h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Kami percaya setiap detik berharga memiliki ceritanya sendiri. Melalui layanan {title}, Lentera Cinema hadir untuk memastikan memori Anda terekam dengan sempurna dalam sebuah mahakarya visual.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
