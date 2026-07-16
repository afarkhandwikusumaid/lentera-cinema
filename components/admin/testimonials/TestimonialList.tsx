import { Edit2, Trash2, Star } from 'lucide-react';
import { Testimonial } from '@/lib/db';

export default function TestimonialList({
  testimonials,
  handleOpenEdit,
  handleDelete
}: {
  testimonials: Testimonial[];
  handleOpenEdit: (item: Testimonial) => void;
  handleDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-500 uppercase font-bold tracking-wider">
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
                <td colSpan={5} className="text-center py-12 text-gray-500 text-sm">
                  Belum ada testimoni.
                </td>
              </tr>
            ) : (
              testimonials.map((test) => (
                <tr key={test.id} className="transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900 text-sm whitespace-nowrap">
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
                            i < test.rating ? 'fill-current text-accent-primary' : 'text-gray-500/40'
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
                      <span className="text-gray-500 text-[10px]">Regular</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleOpenEdit(test)}
                        className="p-2 rounded bg-gray-50 text-gray-500 transition-all"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-2 rounded bg-gray-50 text-gray-500 transition-all border border-transparent"
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
  );
}
