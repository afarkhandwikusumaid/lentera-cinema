'use client';

import { useState, useEffect } from 'react';
import { getPortfolio, savePortfolioItem, deletePortfolioItem, PortfolioItem, getServices, Service } from '@/lib/db';
import { Plus, Edit2, Trash2, Image as ImageIcon, Video, Filter } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

export default function PortfolioManager({ mediaType }: { mediaType: 'image' | 'video' }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getPortfolio();
    const svcs = await getServices();
    setItems(data);
    setServices(svcs);
    setLoading(false);
  };

  const handleEdit = (item: PortfolioItem) => {
    setFormData(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus portofolio ini?')) {
      const updated = await deletePortfolioItem(id);
      setItems(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: PortfolioItem = {
      id: formData.id || 'port-' + Date.now().toString(),
      service_id: formData.service_id || (services[0]?.id || ''),
      title: formData.title || '',
      media_url: formData.media_url || '',
      media_type: formData.media_type || 'image',
      is_featured: formData.is_featured || false,
      order: formData.order || 0
    };
    
    const updated = await savePortfolioItem(newItem);
    setItems(updated);
    setIsEditing(false);
    setFormData({});
  };

  const filteredByType = items.filter(i => i.media_type === mediaType);
  const filteredItems = filter === 'all' ? filteredByType : filteredByType.filter(i => i.service_id === filter);

  if (loading) return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mb-4"></div>
        <p className="font-medium">Memuat data portofolio...</p>
      </div>
    </AdminLayout>
  );

  if (isEditing) {
    return (
      <AdminLayout>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-900">{formData.id ? 'Edit Portofolio' : 'Tambah Portofolio'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Judul Karya</label>
              <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c29631]/50 focus:border-[#c29631] outline-none text-gray-900 transition-all text-sm" 
                     placeholder="Misal: Wedding of Dian & Rian"
                     value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Kategori Layanan</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c29631]/50 focus:border-[#c29631] outline-none text-gray-900 transition-all text-sm"
                      value={formData.service_id || ''} onChange={e => setFormData({...formData, service_id: e.target.value})}>
                <option value="">-- Pilih Layanan --</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-[#c29631]/5 border border-[#c29631]/20 rounded-xl p-4 flex items-center justify-center gap-2 text-[#c29631] mb-2">
            {mediaType === 'image' ? (
              <><ImageIcon size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Format: Gambar / Foto</span></>
            ) : (
              <><Video size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Format: Video / IG Reels</span></>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              {mediaType === 'video' ? 'Tautan Video (Instagram / YouTube)' : 'Unggah Foto dari Perangkat'}
            </label>
            
            {mediaType === 'video' ? (
              <div>
                <input required type="url" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c29631]/50 focus:border-[#c29631] outline-none text-gray-900 transition-all text-sm" 
                       placeholder="https://www.instagram.com/reel/..."
                       value={formData.media_url || ''} onChange={e => setFormData({...formData, media_url: e.target.value})} />
                <p className="text-xs text-gray-500 mt-2">Tempelkan link langsung menuju video IG Reels atau YouTube.</p>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input type="text" readOnly className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-500 text-sm" 
                         placeholder="URL gambar akan muncul di sini" value={formData.media_url || ''} />
                  <label className="bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-bold cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap shadow-sm flex items-center justify-center">
                    Pilih Foto
                    <input type="file" accept="image/*" className="hidden" 
                           onChange={async (e) => {
                             const file = e.target.files?.[0];
                             if (!file) return;
                             if (file.size > 2 * 1024 * 1024) { alert('Ukuran foto maksimal 2MB'); return; }
                             const fd = new FormData();
                             fd.append('file', file); fd.append('bucket', 'uploads'); fd.append('folder', 'portfolio');
                             try {
                               const res = await fetch('/api/upload', { method: 'POST', body: fd });
                               const data = await res.json();
                               if (data.success) setFormData({...formData, media_url: data.url});
                               else alert(data.message || 'Gagal mengunggah foto');
                             } catch (err) { alert('Terjadi kesalahan saat mengunggah foto'); }
                           }} />
                  </label>
                </div>
                {formData.media_url && (
                  <img src={formData.media_url} alt="Preview" className="mt-3 h-24 w-auto rounded-lg object-cover border border-gray-200 shadow-sm" />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <input type="checkbox" id="featured" className="w-4 h-4 text-[#c29631] focus:ring-[#c29631] border-gray-300 rounded cursor-pointer"
                   checked={formData.is_featured || false} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
            <label htmlFor="featured" className="text-sm font-bold text-gray-700 cursor-pointer">Tandai sebagai Karya Pilihan (Tampil di Halaman Utama)</label>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
            <button type="submit" className="bg-[#c29631] hover:bg-[#a57f29] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">Simpan Portofolio</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold transition-all">Batal</button>
          </div>
        </form>
      </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Manajemen Portofolio {mediaType === 'image' ? 'Foto' : 'Video'}</h1>
          <p className="text-sm text-text-secondary">Kelola galeri {mediaType === 'image' ? 'foto' : 'video'} semua layanan</p>
        </div>

        <button onClick={() => { setFormData({ media_type: mediaType }); setIsEditing(true); }} className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-bold transition-colors self-start md:self-auto">
          <Plus className="h-4 w-4" /> Tambah {mediaType === 'image' ? 'Foto' : 'Video'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#c29631] text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>Semua</button>
        {services.map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === s.id ? 'bg-[#c29631] text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const serviceName = services.find(s => s.id === item.service_id)?.name || 'Unknown';
          return (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-video relative bg-gray-100 overflow-hidden">
                {item.media_type === 'video' ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                    <Video className="w-8 h-8 opacity-50" />
                  </div>
                ) : (
                  <img src={item.media_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500" />
                )}
                <div className="absolute top-2 right-2 flex gap-1 transition-opacity">
                  <button onClick={() => handleEdit(item)} className="p-1.5 bg-white/90 backdrop-blur rounded text-gray-700"><Edit2 size={14}/></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-white/90 backdrop-blur rounded text-gray-700"><Trash2 size={14}/></button>
                </div>
                {item.is_featured && <span className="absolute top-2 left-2 bg-[#c29631] text-white text-[10px] font-bold px-2 py-0.5 rounded">FEATURED</span>}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#c29631] mb-1">
                  {item.media_type === 'video' ? <Video size={12}/> : <ImageIcon size={12}/>}
                  {serviceName}
                </div>
                <h3 className="font-bold text-gray-900 text-sm truncate">{item.title}</h3>
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white border border-gray-100 rounded-2xl border-dashed">
            Belum ada portofolio di kategori ini.
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}
