import { X } from 'lucide-react';
import { Testimonial } from '@/lib/db';

export default function TestimonialFormModal({
  editingTestimonial,
  clientName,
  photoUrl,
  content,
  rating,
  isFeatured,
  setClientName,
  setPhotoUrl,
  setContent,
  setRating,
  setIsFeatured,
  setIsOpen,
  handleSubmit
}: {
  editingTestimonial: Testimonial | null;
  clientName: string;
  photoUrl: string;
  content: string;
  rating: number;
  isFeatured: boolean;
  setClientName: (v: string) => void;
  setPhotoUrl: (v: string) => void;
  setContent: (v: string) => void;
  setRating: (v: number) => void;
  setIsFeatured: (v: boolean) => void;
  setIsOpen: (v: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
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
  );
}
