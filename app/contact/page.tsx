'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Send, Check } from 'lucide-react';
import Nav from '@/components/PublicNav';
import Footer from '@/components/PublicFooter';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  const CONTACTS = [
    { icon: <Phone size={14} />, label: 'WhatsApp', value: '0859-4462-9716', href: 'https://wa.me/6285944629716?text=Halo%20Lentera%20Cinema,%20saya%20tertarik%20untuk%20konsultasi%20layanan%20dokumentasi.' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>, label: 'Instagram', value: '@lentera.cinema', href: 'https://instagram.com/lentera.cinema' },
    { icon: <Mail size={14} />, label: 'Email', value: 'hello@lenteracinema.id', href: 'mailto:hello@lenteracinema.id' },
    { icon: <MapPin size={14} />, label: 'Studio', value: 'Batang, Jawa Tengah', href: 'https://maps.google.com/?q=Batang,Jawa+Tengah' },
  ];

  return (
    <>
      <Nav />
      <div className="pt-24 pb-10 bg-black border-b border-[#2a2a2a]">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-[9px] uppercase tracking-[0.18em] text-[#888] mb-2">Kontak</p>
          <h1 className="font-bold text-white" style={{ fontSize: 'clamp(2rem,7vw,4rem)', letterSpacing: '-0.05em' }}>Hubungi kami</h1>
        </div>
      </div>

      <main className="py-14 bg-black min-h-screen">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left */}
          <div className="space-y-6">
            <div className="space-y-3">
              {CONTACTS.map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition group">
                  <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] group-hover:text-[#e8b84b] transition shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider font-bold text-[#888]">{c.label}</p>
                    <p className="text-sm font-medium text-white">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Hours */}
            <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#2a2a2a]">
              <p className="text-xs font-bold text-white mb-3">Jam Operasional</p>
              <div className="space-y-1.5 text-xs text-[#888]">
                <div className="flex justify-between"><span>Senin – Jumat</span><span className="text-white">09.00 – 18.00 WIB</span></div>
                <div className="flex justify-between"><span>Sabtu</span><span className="text-white">09.00 – 15.00 WIB</span></div>
                <div className="flex justify-between"><span>Minggu</span><span>Libur</span></div>
              </div>
            </div>

            <div className="flex gap-2">
              <a href="https://wa.me/6285944629716?text=Halo%20Lentera%20Cinema,%20saya%20tertarik%20untuk%20konsultasi%20layanan%20dokumentasi." target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center py-3 rounded-full font-semibold text-sm text-black hover:brightness-105 transition" style={{ background: '#25D366' }}>
                Chat WhatsApp
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-[#0f0f0f] rounded-2xl border border-[#2a2a2a] p-6">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full min-h-60 text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e]/25 flex items-center justify-center">
                  <Check size={20} className="text-[#3ecf8e]" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Pesan Terkirim!</p>
                  <p className="text-xs text-[#888]">Tim kami akan menghubungi Anda dalam 1×24 jam.</p>
                </div>
                <button onClick={() => { setSent(false); setForm({ name: '', phone: '', message: '' }); }}
                  className="px-5 py-2 rounded-full border border-[#2a2a2a] text-xs text-[#888] hover:text-white">
                  Kirim pesan lain
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="text-base font-bold text-white">Kirim Pesan</h2>
                {[
                  { k: 'name' as const, label: 'Nama', ph: 'Nama Anda', type: 'text' },
                  { k: 'phone' as const, label: 'WhatsApp', ph: '08xxxxxxxxxx', type: 'tel' },
                ].map(f => (
                  <div key={f.k}>
                    <label className="text-[9px] uppercase tracking-wider font-bold text-[#888] block mb-1">{f.label}</label>
                    <input type={f.type} required placeholder={f.ph} value={form[f.k]} onChange={set(f.k)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white placeholder:text-[#888] focus:outline-none focus:border-[#e8b84b]/50 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-[9px] uppercase tracking-wider font-bold text-[#888] block mb-1">Pesan</label>
                  <textarea required rows={4} placeholder="Ceritakan kebutuhan Anda..." value={form.message} onChange={set('message')}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white placeholder:text-[#888] focus:outline-none focus:border-[#e8b84b]/50 transition-colors resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#e8b84b] text-black font-semibold text-sm hover:brightness-105 transition disabled:opacity-60">
                  {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Send size={14} />}
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
