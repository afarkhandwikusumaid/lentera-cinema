'use client';

import { useState, useEffect } from 'react';
import { getProjects, saveProject, deleteProject, Project } from '@/lib/db';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { useModal } from '@/components/admin/ModalContext';

export default function ProjectsAdmin() {
  const { showAlert, showConfirm } = useModal();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const fetchData = async () => {
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleEdit = (project: Project) => {
    setFormData(project);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (await showConfirm('Yakin ingin menghapus proyek ini?')) {
      const updated = await deleteProject(id);
      setProjects(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = formData.qty || 1;
    const price = formData.price || 0;
    const total_value = qty * price;

    const newProject: Project = {
      id: formData.id || 'proj-' + Date.now().toString(),
      name: formData.name || '',
      client_name: formData.client_name || '',
      qty,
      price,
      total_value,
      status: formData.status || 'active',
      created_at: formData.created_at || new Date().toISOString()
    };
    
    const updated = await saveProject(newProject);
    setProjects(updated);
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
        <h2 className="text-xl font-bold text-text-primary mb-6">{formData.id ? 'Edit Proyek' : 'Tambah Proyek'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Nama Proyek</label>
            <input required type="text" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" 
                   value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} 
                   placeholder="Contoh: Yearbook 2026" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Nama Klien / Instansi</label>
            <input required type="text" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" 
                   value={formData.client_name || ''} onChange={e => setFormData({...formData, client_name: e.target.value})} 
                   placeholder="Contoh: SMA 1 Jakarta" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Kuantitas (Mis: 300 siswa)</label>
              <input required type="number" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" 
                     value={formData.qty || ''} onChange={e => setFormData({...formData, qty: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Harga per Satuan (Rp)</label>
              <input required type="number" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" 
                     value={formData.price || ''} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Status</label>
            <select className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm"
                    value={formData.status || 'active'} onChange={e => setFormData({...formData, status: e.target.value as 'active' | 'completed' | 'cancelled'})}>
              <option value="active">Aktif</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Manajemen Proyek</h1>
          <p className="text-sm text-text-secondary">Kelola daftar proyek, harga, dan klien</p>
        </div>
        <button onClick={() => { setFormData({ qty: 1, price: 0, status: 'active' }); setIsEditing(true); }} className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-bold transition-colors self-start md:self-auto">
          <Plus className="h-4 w-4" /> Tambah Proyek
        </button>
      </div>

      <div className="bg-bg-surface rounded-2xl border border-border/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-elevated border-b border-border/50 text-[10px] uppercase tracking-widest text-text-secondary font-bold">
              <th className="p-4">Nama Proyek</th>
              <th className="p-4">Klien</th>
              <th className="p-4">Total Nilai</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-gray-50 transition-colors">
                <td className="p-4 font-bold text-text-primary text-sm hover:text-[#c29631]">
                  <Link href={`/adminlentera/projects/${project.id}`}>{project.name}</Link>
                </td>
                <td className="p-4 text-text-secondary text-sm">{project.client_name}</td>
                <td className="p-4 font-semibold text-text-primary text-sm">
                  {formatCurrency(project.total_value)}
                  <div className="text-[10px] text-text-secondary/70 font-normal">{project.qty} x {formatCurrency(project.price)}</div>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${project.status === 'active' ? 'bg-green-100 text-green-700' : project.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {project.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 transition-opacity">
                    <Link href={`/adminlentera/projects/${project.id}`} className="p-2 text-text-secondary/70 bg-bg-surface rounded-lg border border-border/50 text-xs font-bold hover:text-[#c29631]">Detail</Link>
                    <button onClick={() => handleEdit(project)} className="p-2 text-text-secondary/70 bg-bg-surface rounded-lg border border-border/50"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 text-text-secondary/70 bg-bg-surface rounded-lg border border-border/50"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-secondary/70">Belum ada proyek terdaftar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </AdminLayout>
  );
}
