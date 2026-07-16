import { Service } from '@/lib/db';
import { useModal } from '@/components/admin/ModalContext';

export default function ServiceForm({
  currentService,
  setCurrentService,
  handleSaveService,
  setIsEditing
}: {
  currentService: Partial<Service>;
  setCurrentService: (s: Partial<Service>) => void;
  handleSaveService: (e: React.FormEvent) => void;
  setIsEditing: (v: boolean) => void;
}) {
  const { showAlert } = useModal();
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
      <h2 className="text-xl font-bold mb-4">{currentService.id ? 'Edit Kategori Layanan' : 'Kategori Layanan Baru'}</h2>
      <form onSubmit={handleSaveService} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Layanan</label>
            <input type="text" value={currentService.name || ''} onChange={e => setCurrentService({...currentService, name: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-white text-black" required placeholder="Misal: Yearbook"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input type="text" value={currentService.slug || ''} onChange={e => setCurrentService({...currentService, slug: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-white text-black" required placeholder="misal: yearbook"/>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input type="text" value={currentService.subtitle || ''} onChange={e => setCurrentService({...currentService, subtitle: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-white text-black" placeholder="e.g. Buku Tahunan Premium"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea value={currentService.description || ''} onChange={e => setCurrentService({...currentService, description: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none h-24 bg-white text-black" required/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Video URL (opsional)</label>
            <input type="text" value={currentService.video_url || ''} onChange={e => setCurrentService({...currentService, video_url: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-white text-black" placeholder="https://...mp4"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
            <div className="flex flex-col gap-3">
              <label className="bg-black text-white px-4 py-2 rounded text-sm font-bold cursor-pointer hover:bg-gray-800 transition-colors inline-block w-max">
                Pilih File dari Perangkat
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 1 * 1024 * 1024) {
                      await showAlert('Ukuran file maksimal 1MB');
                      return;
                    }
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('bucket', 'uploads');
                    formData.append('folder', 'services');
                    try {
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (data.success || data.url) {
                        setCurrentService({...currentService, image_url: data.url});
                      } else {
                        await showAlert(data.message || 'Gagal mengunggah foto');
                      }
                    } catch {
                      await showAlert('Terjadi kesalahan saat mengunggah foto');
                    }
                  }} 
                />
              </label>
            {currentService.image_url && (
              <img src={currentService.image_url} alt="Thumbnail preview" className="mt-2 h-20 w-auto rounded object-cover border border-gray-200" />
            )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" checked={currentService.is_active} onChange={e => setCurrentService({...currentService, is_active: e.target.checked})} className="w-4 h-4"/>
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktifkan Layanan</label>
        </div>
        <div className="flex gap-2 pt-4">
          <button type="submit" className="bg-black text-white px-4 py-2 rounded font-bold">Simpan</button>
          <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold">Batal</button>
        </div>
      </form>
    </div>
  );
}
