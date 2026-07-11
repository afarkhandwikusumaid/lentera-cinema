import React from 'react';

export const AI_ICONS = {
  Image: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Video: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  Voice: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  Music: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
};

export const TOOLS = [
  { name: 'Yearbook', icon: AI_ICONS.Image },
  { name: 'Wedding', icon: AI_ICONS.Video },
  { name: 'Graduation', icon: AI_ICONS.Image },
  { name: 'Cinematic', icon: AI_ICONS.Video },
  { name: 'Studio', icon: AI_ICONS.Voice },
  { name: 'Aerial', icon: AI_ICONS.Image },
];

export const FAQS = [
  { q: 'Apa itu Lentera Cinema?', a: 'Lentera Cinema adalah vendor kreatif profesional untuk dokumentasi momen penting seperti Yearbook, Wedding, Foto dan Video Wisuda dengan sentuhan sinematik berkualitas tinggi.' },
  { q: 'Bagaimana proses pemesanannya?', a: 'Anda dapat melihat paket layanan kami dan menghubungi kami secara langsung via WhatsApp untuk diskusi konsep dan jadwal. DP 30% diperlukan untuk mengamankan tanggal.' },
  { q: 'Berapa lama estimasi pengerjaan proyek?', a: 'Untuk foto dan video wisuda biasanya memakan waktu 2–4 minggu. Sedangkan untuk pembuatan Yearbook cetak eksklusif, proses memakan waktu 8–12 minggu.' },
  { q: 'Apakah melayani paket kustom / custom package?', a: 'Tentu. Jika Anda memiliki kebutuhan khusus yang tidak ada di paket standar, hubungi produser kami untuk mendiskusikan konsep dan penyesuaian harga.' },
];
