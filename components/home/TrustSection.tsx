import React from 'react';

export default function TrustSection() {
  return (
    <section className="py-28 bg-[#000] border-t border-white/5 relative overflow-hidden">
      {/* Subtle background gradient glow */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-[#e8b84b]/[0.02] via-[#7c5cff]/[0.01] to-transparent pointer-events-none" />
      
      <div className="mx-auto max-w-[1200px] px-6 relative z-10 flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-24">
        {/* Left Column: Big bold editorial typography */}
        <div className="lg:w-1/2">
          <h2 className="font-serif font-medium text-white leading-[1.05]" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}>
            <span className="text-[#e8b84b]">200+</span> Klien Kreatif <br />Memilih Lentera
          </h2>
        </div>

        {/* Right Column: Bullet list with gold checkmarks */}
        <div className="lg:w-1/2 space-y-8 pt-4">
          {[
            { t: 'Ekosistem Kreatif Terlengkap', d: 'Satu pintu untuk seluruh kebutuhan dokumentasi penting Anda — video cinematic, foto studio, yearbook, hingga aftermovie event.' },
            { t: 'Kualitas Sinematik Tanpa Kompromi', d: 'Kami mengadopsi kamera kelas industri, teknik pencahayaan studio mutakhir, dan pengambilan gambar udara dengan drone.' },
            { t: 'Proses Produksi Terstruktur', d: 'Dari perancangan konsep bersama sutradara, pengarahan gaya di lokasi, hingga editing presisi, semua terpantau rapi.' },
          ].map((bullet, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="text-[#e8b84b] font-bold text-xl leading-none mt-1">✓</span>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{bullet.t}</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-md">{bullet.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
