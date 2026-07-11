'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { getTestimonials, saveTestimonial, deleteTestimonial, Testimonial } from '@/lib/db';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Modal Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form Fields State
  const [clientName, setClientName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isFeatured, setIsFeatured] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setClientName('');
    setPhotoUrl('');
    setContent('');
    setRating(5);
    setIsFeatured(true);
    setIsOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingTestimonial(item);
    setClientName(item.client_name);
    setPhotoUrl(item.photo_url || '');
    setContent(item.content);
    setRating(item.rating);
    setIsFeatured(item.is_featured);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
      await deleteTestimonial(id);
      await loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !content) return;

    const newTestimonial: Testimonial = {
      id: editingTestimonial ? editingTestimonial.id : `test-${Date.now()}`,
      client_name: clientName,
      photo_url: photoUrl || undefined,
      content: content,
      rating: rating,
      is_featured: isFeatured,
    };

    await saveTestimonial(newTestimonial);
    setIsOpen(false);
    await loadData();
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">Manajemen Testimoni</h1>
            <p className="text-sm text-text-secondary mt-1">
              Kelola ulasan & bintang dari klien untuk membangun kepercayaan calon pelanggan baru.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-primary text-black font-semibold text-xs transition-all"
          >
            <Plus className="h-4 w-4" /> Tambah Testimoni Baru
          </button>
        </div>

        {/* Testimonials Table list */}
        <div className="bg-bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-bg-elevated/50 text-text-secondary uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Nama Klien</th>
                  <th className="py-4 px-6">Isi Ulasan</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Status Tampil</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-text-secondary text-sm">
                      Belum ada testimoni.
                    </td>
                  </tr>
                ) : (
                  testimonials.map((test) => (
                    <tr key={test.id} className="transition-colors">
                      <td className="py-4 px-6 font-bold text-text-primary text-sm whitespace-nowrap">
                        {test.client_name}
                      </td>
                      <td className="py-4 px-6 max-w-sm truncate" title={test.content}>
                        {test.content}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex text-accent-primary gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < test.rating ? 'fill-current text-accent-primary' : 'text-text-secondary/40'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {test.is_featured ? (
                          <span className="px-2 py-0.5 rounded bg-success/10 text-success border border-success/30 font-bold text-[10px] uppercase">
                            Featured
                          </span>
                        ) : (
                          <span className="text-text-secondary text-[10px]">Regular</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleOpenEdit(test)}
                            className="p-2 rounded bg-bg-elevated text-text-secondary transition-all"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(test.id)}
                            className="p-2 rounded bg-bg-elevated text-text-secondary transition-all border border-transparent"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-xl w-full bg-white border border-gray-200 rounded-2xl overflow-hidden animate-scaleUp shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-heading font-bold text-base text-gray-900">
                {editingTestimonial ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto bg-white">
              <div className="space-y-1">
                <label htmlFor="clientNameTest" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Nama Klien / Instansi</label>
                <input
                  id="clientNameTest"
                  type="text"
                  required
                  placeholder="mis: Sarah Amalia (Panitia SMA 5)"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="clientPhoto" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Foto Klien URL (Opsional)</label>
                  <input
                    id="clientPhoto"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Rating Ulasan (Bintang)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all cursor-pointer"
                  >
                    <option value="5">Bintang 5</option>
                    <option value="4">Bintang 4</option>
                    <option value="3">Bintang 3</option>
                    <option value="2">Bintang 2</option>
                    <option value="1">Bintang 1</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="testimonialText" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Isi Ulasan Testimoni</label>
                <textarea
                  id="testimonialText"
                  rows={4}
                  required
                  placeholder="Ketik ulasan kepuasan pelanggan terhadap hasil kerja Lentera Cinema..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all leading-normal"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  id="isFeaturedTest"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-accent-primary focus:ring-accent-primary"
                />
                <label htmlFor="isFeaturedTest" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Tampilkan testimoni ini di Halaman Utama
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-accent-primary text-white font-bold text-xs hover:bg-[#a67c21] transition-colors"
                >
                  {editingTestimonial ? 'Simpan Perubahan' : 'Tambah Testimoni'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
