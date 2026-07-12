import { Plus, Settings, Edit2, Trash2 } from 'lucide-react';
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
              <th className="p-4 font-medium">Layanan</th>
              <th className="p-4 font-medium">Subtitle</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} className="border-b border-gray-100">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-500 mt-1">/{service.slug}</div>
                </td>
                <td className="p-4"><span className="text-sm text-gray-600">{service.subtitle || '-'}</span></td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{service.is_active ? 'Aktif' : 'Tidak Aktif'}</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => startManageBenefits(service)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-black rounded-lg transition-colors hover:bg-gray-800"><Settings size={14} /> Kelola Benefit</button>
                    <button onClick={() => startEditService(service)} className="p-2 text-gray-400 bg-white border rounded-lg transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteService(service.id)} className="p-2 text-gray-400 bg-white border rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Belum ada layanan ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
