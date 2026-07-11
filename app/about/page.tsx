'use client';
import Link from 'next/link';
import Nav from '@/components/PublicNav';
import Footer from '@/components/PublicFooter';
import { COMPANY_STATS, TEAM_MEMBERS } from '@/lib/data';

export default function About() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <div className="relative pt-24 pb-16 bg-black overflow-hidden">
        <img src="/images/video_wisuda.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black" />
        <div className="relative mx-auto max-w-6xl px-4">
          <p className="text-[9px] uppercase tracking-[0.18em] text-[#888] mb-2">Tentang Kami</p>
          <h1 className="font-bold text-white max-w-xl" style={{ fontSize: 'clamp(2rem,7vw,4rem)', letterSpacing: '-0.05em', lineHeight: '1.05' }}>
            Kami abadikan<br /><span className="gold-text">momen terbaik</span>
          </h1>
          <p className="mt-4 text-sm text-[#888] max-w-sm">
            Studio kreatif untuk wisuda, pernikahan, dan buku kenangan sekolah — dalam kualitas film sinematik.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#0f0f0f] border-y border-[#2a2a2a] py-12">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {COMPANY_STATS.map((s, i) => (
            <div key={i}>
              <p className="font-bold text-white" style={{ fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '-0.04em' }}>{s.v}</p>
              <p className="text-xs text-[#888] mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission split */}
      <section className="py-16 bg-black border-b border-[#2a2a2a]">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h2 className="font-bold text-white" style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)', letterSpacing: '-0.04em' }}>Membuat kenangan yang bertahan selamanya</h2>
            <p className="text-sm text-[#888] leading-relaxed">Kami percaya setiap momen penting layak diabadikan dengan standar sinematik tertinggi — bukan sekadar foto biasa, tapi sebuah karya yang membawa kembali emosi setiap kali ditonton.</p>
            <p className="text-sm text-[#888] leading-relaxed">Dengan fotografer & videografer bersertifikasi, Lentera Cinema hadir sebagai mitra kreatif terpercaya dari sekolah, universitas, dan pasangan pengantin di seluruh Indonesia.</p>
            <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-sm text-white font-medium hover:text-[#e8b84b] transition">
              Lihat portofolio kami →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="/images/yearbook.png" alt="" className="rounded-2xl object-cover aspect-[3/4] border border-[#2a2a2a] opacity-80" />
            <div className="flex flex-col gap-3 pt-6">
              <img src="/images/wedding.png" alt="" className="rounded-2xl object-cover aspect-square border border-[#2a2a2a] opacity-80" />
              <img src="/images/graduation.png" alt="" className="rounded-2xl object-cover aspect-square border border-[#2a2a2a] opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-[#0f0f0f] border-b border-[#2a2a2a]">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-[9px] uppercase tracking-[0.18em] text-[#888] mb-2">Tim Kami</p>
          <h2 className="font-bold text-white mb-8" style={{ fontSize: 'clamp(1.5rem,4vw,2.5rem)', letterSpacing: '-0.04em' }}>Di balik lensa</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM_MEMBERS.map((m, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a]">
                <div className="aspect-square overflow-hidden">
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-white">{m.name}</p>
                  <p className="text-[9px] text-[#e8b84b] uppercase tracking-wider font-bold mb-1">{m.role}</p>
                  <p className="text-[10px] text-[#888] leading-relaxed">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black">
        <div className="mx-auto max-w-md px-4 text-center space-y-5">
          <h2 className="font-bold text-white" style={{ fontSize: 'clamp(1.6rem,5vw,2.8rem)', letterSpacing: '-0.04em' }}>Siap bekerja sama?</h2>
          <p className="text-sm text-[#888]">Konsultasi gratis, tanpa komitmen.</p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <a href="https://wa.me/6285944629716?text=Halo%20Lentera%20Cinema,%20saya%20tertarik%20untuk%20bekerja%20sama." target="_blank" rel="noreferrer" className="px-6 py-2.5 rounded-full bg-[#e8b84b] text-black font-semibold text-sm hover:brightness-105 transition">Booking WhatsApp</a>
            <Link href="/contact" className="px-6 py-2.5 rounded-full border border-[#2a2a2a] text-white text-sm hover:bg-[#1a1a1a] transition">Kontak</Link>
          </div>
        </div>
      </section>

      <Footer />
      <WaFab />
    </>
  );
}

function WaFab() {
  return (
    <a href="https://wa.me/6285944629716?text=Halo%20Lentera%20Cinema,%20saya%20tertarik%20untuk%20bekerja%20sama." target="_blank" rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center rounded-full shadow-lg hover:scale-105 transition-transform"
      style={{ background: '#25D366', width: 52, height: 52 }} aria-label="WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  );
}
