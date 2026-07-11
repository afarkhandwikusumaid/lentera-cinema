'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Nav from '@/components/PublicNav';
import Footer from '@/components/PublicFooter';
import { getTestimonials, getSchoolClients, Testimonial, SchoolClient } from '@/lib/db';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [schoolClients, setSchoolClients] = useState<SchoolClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [testis, clients] = await Promise.all([
        getTestimonials(),
        getSchoolClients()
      ]);
      setTestimonials(testis);
      setSchoolClients(clients);
      setLoading(false);
    }
    loadData();
  }, []);

  // Group by year for better display
  const groupedClients = schoolClients.reduce((acc, curr) => {
    if (!acc[curr.year]) acc[curr.year] = [];
    acc[curr.year].push(curr);
    return acc;
  }, {} as Record<string, SchoolClient[]>);

  // Sort years descending
  const sortedYears = Object.keys(groupedClients).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <>
      <Nav />
      <div className="pt-24 pb-10 bg-black border-b border-[#2a2a2a]">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-[9px] uppercase tracking-[0.18em] text-[#888] mb-3">Testimoni</p>
          <h1 className="text-white mb-4" style={{ fontSize: 'clamp(2rem,6vw,4rem)', letterSpacing: '-0.02em', lineHeight: '1.05' }}>Kata Klien Kami</h1>
          <p className="text-sm text-[#888] max-w-md mx-auto">Pengalaman nyata dari klien yang telah mempercayakan momen berharga mereka kepada Lentera Cinema.</p>
        </div>
      </div>

      <main className="py-16 bg-black min-h-screen">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#e8b84b] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {testimonials.map(t => (
                <div key={t.id} className="p-6 rounded-[20px] bg-[#0f0f0f] border border-[#2a2a2a] flex flex-col gap-4 hover:bg-[#151515] transition-colors">
                  <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={13} className="fill-[#e8b84b] text-[#e8b84b]" />)}</div>
                  <p className="text-sm text-[#888] leading-relaxed flex-1 italic">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3 border-t border-[#2a2a2a] pt-4">
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover border border-[#2a2a2a]" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center text-[#e8b84b] font-bold text-lg">
                        {t.client_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{t.client_name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Daftar Sekolah & Instansi (Grouped by Year) */}
            <div className="mx-auto max-w-6xl px-4 mt-24 text-center border-t border-[#2a2a2a] pt-16">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#888] mb-12">Klien & Instansi Pendidikan</p>
              
              <div className="flex flex-wrap justify-center gap-12 lg:gap-24">
                {sortedYears.map((year) => (
                  <div key={year} className="flex flex-col items-center">
                    <h4 className="text-2xl font-serif text-[#e8b84b] mb-6 tracking-tight">{year}</h4>
                    <div className="flex flex-col gap-3 w-full min-w-[280px]">
                      {groupedClients[year].sort((a,b) => a.order - b.order).map((client) => (
                        <div key={client.id} className="px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                          {client.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {sortedYears.length === 0 && (
                <div className="py-12 border border-[#2a2a2a] border-dashed rounded-3xl mt-8">
                  <p className="text-[#888]">Daftar klien belum tersedia.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
