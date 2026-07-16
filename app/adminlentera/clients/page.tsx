'use client';

import { useState, useEffect } from 'react';
import { getSchoolClients, saveSchoolClient, deleteSchoolClient, SchoolClient } from '@/lib/db';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useModal } from '@/components/admin/ModalContext';

export default function ClientsAdmin() {
  const { showAlert, showConfirm } = useModal();
  const [clients, setClients] = useState<SchoolClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<SchoolClient>>({});
  const fetchData = async () => {
    const data = await getSchoolClients();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleEdit = (client: SchoolClient) => {
    setFormData(client);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (await showConfirm('Yakin ingin menghapus klien ini?')) {
      const updated = await deleteSchoolClient(id);
      setClients(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: SchoolClient = {
      id: formData.id || 'client-' + Date.now().toString(),
      name: formData.name || '',
      year: formData.year || new Date().getFullYear().toString(),
      order: formData.order || 0
    };
    
    const updated = await saveSchoolClient(newClient);
    setClients(updated);
    setIsEditing(false);
    setFormData({});
  };

  if (loading) return (
    <AdminLayout>
      <div className="p-10 text-text-secondary">Memuat data...</div>
    </AdminLayout>
  );

  if (isEditing) {
    return (
      <AdminLayout>
      <div className="space-y-6">
      <div className="bg-bg-surface p-6 rounded-2xl border border-border">
        <h2 className="text-xl font-bold text-text-primary mb-6">{formData.id ? 'Edit Klien Sekolah' : 'Tambah Klien Sekolah'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Nama Instansi / Sekolah</label>
            <input required type="text" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" 
                   value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} 
                   placeholder="Contoh: SMA Negeri 1 Jakarta" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Tahun Angkatan/Proyek</label>
            <input required type="text" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" 
                   value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} 
                   placeholder="Contoh: 2026" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Urutan Tampil</label>
            <input type="number" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" 
                   value={formData.order || 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="bg-[#c29631] text-white px-4 py-2 rounded-lg text-sm font-bold">Simpan</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-[#222] text-text-primary px-4 py-2 rounded-lg text-sm font-bold">Batal</button>
          </div>
        </form>
      </div>
      </div>
      </AdminLayout>
    );
  }

  // Group by year for better display
  const groupedClients = clients.reduce((acc, curr) => {
    if (!acc[curr.year]) acc[curr.year] = [];
    acc[curr.year].push(curr);
    return acc;
  }, {} as Record<string, SchoolClient[]>);

  // Sort years descending
  const sortedYears = Object.keys(groupedClients).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Klien Sekolah</h1>
          <p className="text-sm text-text-secondary">Kelola daftar klien berdasarkan tahun proyek</p>
        </div>
        <button onClick={() => { setFormData({}); setIsEditing(true); }} className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-bold transition-colors self-start md:self-auto">
          <Plus className="h-4 w-4" /> Tambah Klien
        </button>
      </div>

      <div className="space-y-8">
        {sortedYears.map(year => (
          <div key={year} className="bg-bg-surface rounded-2xl border border-border/50 overflow-hidden">
            <div className="bg-bg-elevated px-6 py-4 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-bold text-text-primary">Tahun {year}</h2>
              <span className="text-xs font-bold text-[#c29631] bg-[#c29631]/10 px-3 py-1 rounded-full">{groupedClients[year].length} Instansi</span>
            </div>
            <ul className="divide-y divide-gray-50">
              {groupedClients[year].sort((a,b) => a.order - b.order).map(client => (
                <li key={client.id} className="p-4 px-6 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-xs font-bold text-text-secondary/70 border border-border">
                      {client.order}
                    </div>
                    <span className="text-sm font-bold text-text-primary">{client.name}</span>
                  </div>
                  <div className="flex items-center gap-2 transition-opacity">
                    <button onClick={() => handleEdit(client)} className="p-2 text-text-secondary/70 bg-bg-surface rounded-lg border border-border/50"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(client.id)} className="p-2 text-text-secondary/70 bg-bg-surface rounded-lg border border-border/50"><Trash2 size={14}/></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        {sortedYears.length === 0 && (
          <div className="p-12 text-center text-text-secondary/70 bg-bg-surface border border-border/50 rounded-2xl border-dashed">
            Belum ada klien sekolah yang didaftarkan.
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}
