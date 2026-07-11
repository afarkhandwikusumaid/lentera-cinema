'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

const LINKS_LEFT = [
  { label: 'Yearbook', href: '/layanan/yearbook' },
  { label: 'Wisuda', href: '/layanan/wisuda' },
  { label: 'Wedding', href: '/layanan/wedding' },
  { label: 'Event', href: '/layanan/foto-event' },
  { label: 'Komersial', href: '/layanan/dokumentasi-product' },
];

const LINKS_RIGHT = [
  { label: 'Portofolio', href: '/portfolio' },
  { label: 'Testimoni', href: '/testimonials' },
  { label: 'Tentang Kami', href: '/about' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#2a2a2a]' : 'bg-transparent'} h-16`}>
        <div className="mx-auto max-w-[1400px] flex items-center justify-between px-6 h-full">
          
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <img src="/logo.png" alt="Lentera Cinema" className="h-8 md:h-10 object-contain" />
            </Link>

            {/* Desktop Links Left (Services) */}
            <div className="hidden lg:flex items-center gap-6">
              {LINKS_LEFT.map(l => (
                <Link key={l.href} href={l.href}
                  className={`text-[13px] font-medium transition-colors flex items-center gap-1.5 ${path.startsWith(l.href) ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                  {l.label}
                  <ChevronDown size={12} className="opacity-50" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 mr-4">
              {LINKS_RIGHT.map(l => (
                <Link key={l.href} href={l.href}
                  className={`text-[13px] font-medium transition-colors ${path === l.href ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
            
            <a href="https://wa.me/6285944629716?text=Halo%20Lentera%20Cinema,%20saya%20tertarik%20untuk%20konsultasi%20layanan%20dokumentasi." target="_blank" rel="noreferrer"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#e8b84b] to-[#f5d06e] text-black text-[13px] font-bold hover:brightness-110 transition-all hidden md:flex">
              Booking WhatsApp
            </a>
            
            <button onClick={() => setOpen(v => !v)} className="md:hidden p-1.5 text-white/70 hover:text-white">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-full max-w-[320px] bg-[#0a0a0a] border-l border-white/5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-8 h-20 border-b border-white/5">
              <span className="font-serif font-bold text-xl text-white tracking-wide">Menu</span>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all"><X size={24} /></button>
            </div>
            
            <div className="flex-1 flex flex-col px-6 py-8 gap-2 overflow-y-auto no-scrollbar">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#e8b84b] font-bold px-4 pt-2 pb-3">Services</div>
              {LINKS_LEFT.map(l => (
                <Link key={l.href} href={l.href}
                  className={`px-4 py-3.5 rounded-2xl text-base transition-all duration-300 ${path.startsWith(l.href) ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                  {l.label}
                </Link>
              ))}
              
              <div className="h-px bg-white/5 my-6 mx-4" />
              
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#e8b84b] font-bold px-4 pb-3">Menu</div>
              {LINKS_RIGHT.map(l => (
                <Link key={l.href} href={l.href}
                  className={`px-4 py-3.5 rounded-2xl text-base transition-all duration-300 ${path === l.href ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
            
            <div className="p-8 border-t border-white/5 bg-[#0a0a0a]">
              <a href="https://wa.me/6285944629716?text=Halo%20Lentera%20Cinema,%20saya%20tertarik%20untuk%20konsultasi%20layanan%20dokumentasi." target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center py-4 rounded-full bg-[#e8b84b] hover:bg-[#f5d06e] text-black font-bold text-sm tracking-wide hover:brightness-110 active:scale-95 transition-all duration-200">
                Konsultasi WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
