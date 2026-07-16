import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { Service, ServiceBenefit } from '@/lib/db';

export default function BenefitManager({
  activeService,
  benefits,
  isEditingBenefit,
  currentBenefit,
  featuresText,
  startEditBenefit,
  setIsEditingBenefit,
  setCurrentBenefit,
  setFeaturesText,
  handleSaveBenefit,
  handleDeleteBenefit,
  setActiveService
}: {
  activeService: Service;
  benefits: ServiceBenefit[];
  isEditingBenefit: boolean;
  currentBenefit: Partial<ServiceBenefit>;
  featuresText: string;
  startEditBenefit: (b?: ServiceBenefit) => void;
  setIsEditingBenefit: (v: boolean) => void;
  setCurrentBenefit: (b: Partial<ServiceBenefit>) => void;
  setFeaturesText: (t: string) => void;
  handleSaveBenefit: (e: React.FormEvent) => void;
  handleDeleteBenefit: (id: string) => void;
  setActiveService: (s: Service | null) => void;
}) {
  const serviceBenefits = benefits.filter(b => b.service_id === activeService.id).sort((a,b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setActiveService(null)} className="p-2 bg-[#222] hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Benefit: {activeService.name}</h1>
          <p className="text-sm text-text-secondary">Kelola daftar layanan/fitur untuk kategori ini</p>
        </div>
        <button 
          onClick={() => startEditBenefit()}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-bold transition-colors"
        >
          <Plus className="h-4 w-4" /> Tambah Benefit
        </button>
      </div>

      {isEditingBenefit && (
        <div className="bg-bg-surface p-6 rounded-xl border border-border mb-8">
          <h2 className="text-xl font-bold mb-4">{currentBenefit.id ? 'Edit Benefit' : 'Tambah Benefit'}</h2>
          <form onSubmit={handleSaveBenefit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Nama Benefit / Sub-Layanan</label>
              <input type="text" value={currentBenefit.name || ''} onChange={e => setCurrentBenefit({...currentBenefit, name: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-bg-surface text-black" required placeholder="Misal: Foto Studio Indoor" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Deskripsi Singkat</label>
              <textarea value={currentBenefit.description || ''} onChange={e => setCurrentBenefit({...currentBenefit, description: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-bg-surface text-black h-20" placeholder="Misal: Sesi foto eksklusif di dalam studio..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Daftar Fitur (Pisahkan dengan baris baru / enter)</label>
              <textarea value={featuresText} onChange={e => setFeaturesText(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-bg-surface text-black h-32" placeholder="Sesi Foto Studio 45 Menit&#10;Maksimal 6 Orang&#10;Cetak Frame 12R" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Urutan Tampil (Order)</label>
                <input type="number" value={currentBenefit.order || 0} onChange={e => setCurrentBenefit({...currentBenefit, order: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-bg-surface text-black" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" id="isActiveBen" checked={currentBenefit.is_active} onChange={e => setCurrentBenefit({...currentBenefit, is_active: e.target.checked})} className="w-4 h-4" />
                <label htmlFor="isActiveBen" className="text-sm font-medium text-text-primary">Aktifkan</label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button type="submit" className="bg-black text-white px-4 py-2 rounded font-bold">Simpan</button>
              <button type="button" onClick={() => setIsEditingBenefit(false)} className="bg-gray-200 text-text-primary px-4 py-2 rounded font-bold">Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-elevated border-b border-border text-text-secondary text-sm">
              <th className="p-4 font-medium">Nama Benefit</th>
              <th className="p-4 font-medium">Fitur</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {serviceBenefits.map(ben => (
              <tr key={ben.id} className="border-b border-border/50">
                <td className="p-4 font-bold text-text-primary">{ben.name}</td>
                <td className="p-4 text-sm text-text-secondary">
                  <ul className="list-disc pl-4">
                    {ben.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${ben.is_active ? 'bg-green-100 text-green-700' : 'bg-[#222] text-text-secondary'}`}>{ben.is_active ? 'Aktif' : 'Tidak Aktif'}</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => startEditBenefit(ben)} className="p-2 text-text-secondary/70 rounded transition-colors bg-bg-surface border"><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteBenefit(ben.id)} className="p-2 text-text-secondary/70 rounded transition-colors bg-bg-surface border"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {serviceBenefits.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-text-secondary">Belum ada benefit ditambahkan.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
