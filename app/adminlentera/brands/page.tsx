'use client';

import { useState, useEffect } from 'react';
import { getBrands, saveBrand, deleteBrand, Brand } from '@/lib/db';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useModal } from '@/components/admin/ModalContext';

export default function BrandsAdmin() {
  const { showAlert, showConfirm } = useModal();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Brand>>({});
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fetchData = async () => {
    const data = await getBrands();
    setBrands(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleEdit = (brand: Brand) => {
    setFormData(brand);
    setUploadFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (await showConfirm('Yakin ingin menghapus brand ini?')) {
      const updated = await deleteBrand(id);
      setBrands(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let logoUrl = formData.logo_url || '';

    if (uploadFile) {
      const uploadData = new FormData();
      uploadData.append('file', uploadFile);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        
        const resData = await res.json();
        
        if (!res.ok) {
          await showAlert(resData.message || 'Gagal mengunggah logo');
          setUploading(false);
          return;
        }

        logoUrl = resData.url;
      } catch (err) {
        console.error('Upload error', err);
        await showAlert('Terjadi kesalahan saat mengunggah file.');
        setUploading(false);
        return;
      }
    }

    const newBrand: Brand = {
      id: formData.id || 'brand-' + Date.now().toString(),
      name: formData.name || '',
      logo_url: logoUrl,
      is_active: formData.is_active ?? true,
      order: formData.order || 0
    };
    
    const updated = await saveBrand(newBrand);
    setBrands(updated);
    setIsEditing(false);
    setFormData({});
    setUploadFile(null);
    setUploading(false);
  };

  if (loading) return (
    <AdminLayout>
      <div className="p-10 text-gray-500">Memuat data...</div>
    </AdminLayout>
  );

  if (isEditing) {
    return (
      <AdminLayout>
      <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{formData.id ? 'Edit Brand/Mitra' : 'Tambah Brand/Mitra'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Nama Brand</label>
            <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" 
                   value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Logo (Maks 1MB, format gambar diizinkan)</label>
            {formData.logo_url && !uploadFile && (
              <div className="mb-2">
                <img src={formData.logo_url} alt="Current logo" className="h-12 object-contain bg-gray-100 p-2 rounded border" />
              </div>
            )}
            <input type="file" accept="image/*" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" 
                   onChange={e => {
                     if (e.target.files && e.target.files.length > 0) {
                       setUploadFile(e.target.files[0]);
                     }
                   }} />
            <p className="text-[10px] text-gray-400 mt-1">Kosongkan jika tidak ingin mengubah logo saat ini.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Urutan Tampil</label>
            <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" 
                   value={formData.order || 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="active" checked={formData.is_active ?? true} 
                   onChange={e => setFormData({...formData, is_active: e.target.checked})} />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">Aktif (Tampil di website)</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={uploading} className="bg-[#c29631] text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
              {uploading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} disabled={uploading} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Batal</button>
          </div>
        </form>
      </div>
      </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Mitra & Brand Klien</h1>
          <p className="text-sm text-text-secondary">Kelola logo klien besar (BUMN, Perusahaan, dll)</p>
        </div>
        <button onClick={() => { setFormData({}); setUploadFile(null); setIsEditing(true); }} className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-bold transition-colors self-start md:self-auto">
          <Plus className="h-4 w-4" /> Tambah Brand
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              <th className="p-4 w-12 text-center">Urutan</th>
              <th className="p-4">Logo</th>
              <th className="p-4">Nama Brand</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, i) => (
              <tr key={brand.id} className="border-b border-gray-50 transition-colors">
                <td className="p-4 text-center text-gray-400 font-medium">{brand.order}</td>
                <td className="p-4">
                  <div className="h-10 w-24 bg-gray-100 rounded flex items-center justify-center p-2">
                    <img src={brand.logo_url} alt={brand.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-900 text-sm">{brand.name}</td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${brand.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {brand.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 transition-opacity">
                    <button onClick={() => handleEdit(brand)} className="p-2 text-gray-400 bg-white rounded-lg border border-gray-100"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(brand.id)} className="p-2 text-gray-400 bg-white rounded-lg border border-gray-100"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">Belum ada brand terdaftar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </AdminLayout>
  );
}
