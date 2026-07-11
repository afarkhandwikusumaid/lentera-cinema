'use client';

import { useState, useEffect } from 'react';
import { getServices, saveService, deleteService, Service } from '@/lib/db';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    const data = await getServices();
    setServices(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService.name || !currentService.slug) return;

    const newService: Service = {
      id: currentService.id || `srv-${Date.now()}`,
      name: currentService.name,
      slug: currentService.slug,
      subtitle: currentService.subtitle || '',
      description: currentService.description || '',
      video_url: currentService.video_url || '',
      image_url: currentService.image_url || '',
      is_active: currentService.is_active ?? true,
    };

    const updated = await saveService(newService);
    setServices(updated);
    setIsEditing(false);
    setCurrentService({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const updated = await deleteService(id);
      setServices(updated);
    }
  };

  const startEdit = (service?: Service) => {
    if (service) {
      setCurrentService(service);
    } else {
      setCurrentService({ is_active: true });
    }
    setIsEditing(true);
  };

  if (loading) return <AdminLayout><div className="p-8">Loading services...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Manajemen Layanan</h1>
            <p className="text-sm text-text-secondary">Kelola kategori layanan dan tampilan layanan di beranda.</p>
          </div>
          <button 
            onClick={() => startEdit()}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-bold transition-colors self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            Tambah Layanan
          </button>
        </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">{currentService.id ? 'Edit Service' : 'New Service'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input 
                  type="text" 
                  value={currentService.name || ''} 
                  onChange={e => setCurrentService({...currentService, name: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly)</label>
                <input 
                  type="text" 
                  value={currentService.slug || ''} 
                  onChange={e => setCurrentService({...currentService, slug: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-white text-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input 
                type="text" 
                value={currentService.subtitle || ''} 
                onChange={e => setCurrentService({...currentService, subtitle: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-white text-black"
                placeholder="e.g. Buku Tahunan Premium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={currentService.description || ''} 
                onChange={e => setCurrentService({...currentService, description: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none h-24 bg-white text-black"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Video URL</label>
                <input 
                  type="text" 
                  value={currentService.video_url || ''} 
                  onChange={e => setCurrentService({...currentService, video_url: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-white text-black"
                  placeholder="https://...mp4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image URL</label>
                <input 
                  type="text" 
                  value={currentService.image_url || ''} 
                  onChange={e => setCurrentService({...currentService, image_url: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-black outline-none bg-white text-black"
                  placeholder="/images/yearbook.png"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isActive"
                checked={currentService.is_active} 
                onChange={e => setCurrentService({...currentService, is_active: e.target.checked})}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
            </div>

            <div className="flex gap-2 pt-4">
              <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                Save Service
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
              <th className="p-4 font-medium">Service Name</th>
              <th className="p-4 font-medium">Subtitle</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} className="border-b border-gray-100">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-500 text-xs mt-1">/{service.slug}</div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-600">{service.subtitle || '-'}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => startEdit(service)}
                      className="p-2 text-gray-400 rounded transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-gray-400 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </AdminLayout>
  );
}
