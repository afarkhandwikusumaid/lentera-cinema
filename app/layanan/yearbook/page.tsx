'use client';
import { notFound } from 'next/navigation';
import Nav from '@/components/PublicNav';
import Footer from '@/components/PublicFooter';
import React, { useEffect, useState } from 'react';
import { getServices, getServiceBenefits, getPortfolio, Service, ServiceBenefit, PortfolioItem } from '@/lib/db';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ServicePage() {
  const slug = 'yearbook';

  const [service, setService] = useState<Service | null>(null);
  const [benefits, setBenefits] = useState<ServiceBenefit[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getServices(), getServiceBenefits(), getPortfolio()]).then(([sData, bData, pData]) => {
      const found = sData.find(s => s.slug === slug);
      if (found) {
        setService(found);
        setBenefits(bData.filter(b => b.service_id === found.id && b.is_active).sort((a, b) => a.order - b.order));
        setPortfolios(pData.filter(p => p.service_id === found.id && p.media_type === 'image').sort((a, b) => a.order - b.order));
      }
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white"><div className="w-8 h-8 border-2 border-[#e8b84b] border-t-transparent rounded-full animate-spin" /></div>;
  if (!service) return notFound();

  return (
    <>
      <Nav />
      <section className="pt-32 pb-20 bg-black border-b border-[#2a2a2a] relative overflow-hidden min-h-[60vh] flex flex-col justify-center">
        <div className="absolute inset-0 w-full h-full">
          {service.image_url && <img src={service.image_url} className="w-full h-full object-cover opacity-30 blur-sm" alt="Background" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>
        <div className="mx-auto max-w-5xl px-6 relative z-10 text-center">
          {service.subtitle && <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#e8b84b] mb-4 block">{service.subtitle}</span>}
          <h1 className="text-white mb-6 font-serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: '1' }}>{service.name}</h1>
          <p className="text-[#888] max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-10">{service.description}</p>
          <a href="https://wa.me/6285944629716?text=Halo%20Lentera%20Cinema%2C%20saya%20ingin%20konsultasi%20mengenai%20layanan%20ini." target="_blank" rel="noreferrer"
             className="glow-btn px-8 py-3 rounded-full text-sm font-bold tracking-wide inline-flex items-center gap-2">
            Konsultasi Sekarang <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {benefits.length > 0 && (
        <section className="py-24 bg-black">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-4 block">Detail Layanan</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Apa yang Anda Dapatkan?</h2>
              <div className="h-px w-16 bg-[#e8b84b] mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="bg-[#111] p-8 rounded-2xl border border-[#222] hover:border-[#444] transition-colors">
                  <h3 className="text-xl font-bold text-[#e8b84b] mb-3">{benefit.name}</h3>
                  <p className="text-[#888] text-sm leading-relaxed mb-6">{benefit.description}</p>
                  <ul className="space-y-3">
                    {benefit.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-[#e8b84b] shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {portfolios.length > 0 && (
        <section className="py-24 bg-[#0a0a0a]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-4 block">Galeri Karya</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Hasil Visual {service.name}</h2>
              <div className="h-px w-16 bg-[#e8b84b] mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {portfolios.slice(0, 6).map(item => (
                <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/5">
                  <img src={item.media_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <h3 className="text-white font-bold">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <a href="/portfolio" className="inline-flex items-center justify-center border border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-full text-sm font-bold transition-all">
                Lihat Semua Portofolio
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 bg-[#111]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[#e8b84b] italic mb-6">&ldquo;Merekam Emosi, Mengabadikan Momen&rdquo;</h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Kami percaya setiap detik berharga memiliki ceritanya sendiri. Melalui layanan {service.name}, Lentera Cinema hadir untuk memastikan memori Anda terekam dengan sempurna dalam sebuah mahakarya visual.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
