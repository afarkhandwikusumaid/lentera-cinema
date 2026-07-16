'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { getTestimonials, saveTestimonial, deleteTestimonial, Testimonial } from '@/lib/db';
import TestimonialList from '@/components/admin/testimonials/TestimonialList';
import TestimonialFormModal from '@/components/admin/testimonials/TestimonialFormModal';
import { useModal } from '@/components/admin/ModalContext';

export default function AdminTestimonials() {
  const { showAlert, showConfirm } = useModal();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

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
    if (await showConfirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">Manajemen Testimoni</h1>
            <p className="text-sm text-gray-500 mt-1">
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

        <TestimonialList 
          testimonials={testimonials}
          handleOpenEdit={handleOpenEdit}
          handleDelete={handleDelete}
        />
      </div>

      {isOpen && (
        <TestimonialFormModal 
          editingTestimonial={editingTestimonial}
          clientName={clientName}
          photoUrl={photoUrl}
          content={content}
          rating={rating}
          isFeatured={isFeatured}
          setClientName={setClientName}
          setPhotoUrl={setPhotoUrl}
          setContent={setContent}
          setRating={setRating}
          setIsFeatured={setIsFeatured}
          setIsOpen={setIsOpen}
          handleSubmit={handleSubmit}
        />
      )}
    </AdminLayout>
  );
}
