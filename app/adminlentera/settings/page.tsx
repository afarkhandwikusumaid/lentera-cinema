'use client';

import { useState, useEffect } from 'react';
import { getSettings, saveSettings, SiteSettings } from '@/lib/db';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const data = await getSettings();
    setSettings(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setSaving(true);
    setMessage('');
    
    await saveSettings(settings);
    
    setSaving(false);
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading || !settings) return <AdminLayout><div className="p-8">Loading settings...</div></AdminLayout>;

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Pengaturan Web</h1>
          <p className="text-sm text-text-secondary">Kelola teks judul dan video banner halaman depan.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Hero Banner Section</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title (Headline)</label>
              <input 
                type="text" 
                value={settings.hero_title} 
                onChange={e => setSettings({...settings, hero_title: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none bg-white text-black"
                placeholder="Timeless Wedding & Cinematic Event"
                required
              />
              <p className="text-xs text-gray-500 mt-1">The main big text displayed on the homepage.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea 
                value={settings.hero_subtitle} 
                onChange={e => setSettings({...settings, hero_subtitle: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none h-24 bg-white text-black"
                placeholder="Description below the headline..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Video URL</label>
              <input 
                type="url" 
                value={settings.hero_video_url} 
                onChange={e => setSettings({...settings, hero_video_url: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none bg-white text-black"
                placeholder="https://...mp4"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Direct link to an mp4 video file. This plays silently in the background.</p>
              
              {settings.hero_video_url && (
                <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-gray-100 border relative max-w-sm">
                  <video src={settings.hero_video_url} autoPlay muted loop className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur">Preview</div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-between">
            {message && <div className="text-green-600 font-medium text-sm">{message}</div>}
            <div className={message ? "" : "ml-auto"}>
              <button 
                type="submit" 
                disabled={saving}
                className="bg-black text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </AdminLayout>
  );
}
