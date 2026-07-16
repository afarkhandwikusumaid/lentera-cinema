import { Plus, Settings, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Service } from '@/lib/db';

export default function ServiceList({
  services,
  startEditService,
  startManageBenefits,
  handleDeleteService
}: {
  services: Service[];
  startEditService: (s?: Service) => void;
  startManageBenefits: (s: Service) => void;
  handleDeleteService: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Manajemen Layanan</h1>
          <p className="text-sm text-text-secondary">Kelola kategori utama layanan (Misal: Yearbook, Wedding)</p>
        </div>
        <button 
          onClick={() => startEditService()}
          className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-bold transition-colors self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Tambah Layanan
        </button>
      </div>

      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-elevated border-b border-border text-text-secondary text-sm">
              <th className="p-4 font-medium w-16">Foto</th>
              <th className="p-4 font-medium">Layanan</th>
              <th className="p-4 font-medium">Subtitle</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} className="border-b border-border/50">
                <td className="p-4">
                  {service.image_url ? (
                    <img src={service.image_url} alt={service.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#222] flex items-center justify-center text-text-secondary/70 border border-border">
                      <ImageIcon size={16} />
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-bold text-text-primary">{service.name}</div>
                  <div className="text-sm text-text-secondary mt-1">/{service.slug}</div>
                </td>
                <td className="p-4"><span className="text-sm text-text-secondary">{service.subtitle || '-'}</span></td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${
                    service.is_active 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-[#222] text-[#888] border-[#333]'
                  }`}>
                    {service.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <a 
                      href="/adminlentera/portfolio" 
                      title="Kelola Galeri Portofolio"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#e8b84b] bg-[#e8b84b]/10 border border-[#e8b84b]/20 rounded-lg transition-colors hover:bg-[#e8b84b]/20"
                    >
                      <ImageIcon size={14} /> Galeri
                    </a>
                    <button 
                      onClick={() => startManageBenefits(service)} 
                      title="Kelola Benefit Layanan"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-[#222] border border-[#333] rounded-lg transition-colors hover:bg-[#333] hover:border-[#444]"
                    >
                      <Settings size={14} /> Benefit
                    </button>
                    <button 
                      onClick={() => startEditService(service)} 
                      title="Edit Layanan"
                      className="p-1.5 text-[#888] bg-[#222] border border-[#333] hover:bg-[#333] hover:text-white rounded-lg transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)} 
                      title="Hapus Layanan"
                      className="p-1.5 text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-text-secondary">Belum ada layanan ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
