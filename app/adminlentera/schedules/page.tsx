'use client';
import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Calendar, Plus, Users, X } from 'lucide-react';
import { useModal } from '@/components/admin/ModalContext';

export default function SchedulesPage() {
  const { showAlert, showConfirm } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Manajemen Jadwal & Tim</h1>
            <p className="text-sm text-text-secondary">Atur jadwal shooting dan tugaskan tim lapangan (Kameramen, Fotografer, dll).</p>
          </div>
          <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-bold transition-colors self-start md:self-auto">
            <Plus className="h-4 w-4" />
            Tambah Jadwal
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent-primary" />
                Kalender Jadwal
              </h2>
            </div>
            
            <div className="bg-bg-base border border-border border-dashed rounded-lg h-96 flex flex-col items-center justify-center text-text-muted">
              <Calendar className="h-10 w-10 mb-3 opacity-20" />
              <p>Belum ada jadwal yang ditambahkan bulan ini.</p>
            </div>
          </div>

          <div className="bg-bg-surface border border-border rounded-xl p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-accent-primary" />
                Tim Tersedia
              </h2>
            </div>
            
            <div className="space-y-4">
              {['Andi (Videografer)', 'Budi (Fotografer)', 'Citra (Editor)', 'Deni (Pilot Drone)'].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-bg-base">
                  <span className="text-sm font-medium">{member}</span>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500 font-medium">Ready</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-xl w-full bg-white border border-gray-200 rounded-2xl overflow-hidden animate-scaleUp shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-heading font-bold text-base text-gray-900">
                Tambah Jadwal Baru
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={async (e) => { e.preventDefault(); setIsOpen(false); await showAlert('Jadwal berhasil ditambahkan!'); }} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto bg-white">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Nama Klien / Acara</label>
                <input
                  type="text"
                  required
                  placeholder="mis: Wedding Sarah & Budi"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Tanggal Acara</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Lokasi</label>
                  <input
                    type="text"
                    required
                    placeholder="mis: Gedung Sate, Bandung"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Tugaskan Tim Lapangan</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all cursor-pointer">
                  <option value="">-- Pilih Anggota Tim --</option>
                  <option value="andi">Andi (Videografer)</option>
                  <option value="budi">Budi (Fotografer)</option>
                  <option value="citra">Citra (Editor)</option>
                </select>
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
