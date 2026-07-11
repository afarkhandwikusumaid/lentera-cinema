'use client';

import { useState, useEffect } from 'react';
import { getPortfolio, getServices, PortfolioItem, Service } from '@/lib/db';
import Nav from '@/components/PublicNav';
import Footer from '@/components/PublicFooter';
import { Play, Image as ImageIcon, ArrowLeft, ArrowRight, X } from 'lucide-react';

const DUMMY_PHOTOS = [
  { id: 'd1', title: 'Graduation Class of 2024', media_url: '/images/graduation.png', service_name: 'Wisuda' },
  { id: 'd2', title: 'Aesthetic Yearbook', media_url: '/images/yearbook.png', service_name: 'Yearbook' },
  { id: 'd3', title: 'The Wedding of Dian & Rian', media_url: '/images/wedding.png', service_name: 'Wedding' },
  { id: 'd4', title: 'Cinematic Graduation', media_url: '/images/video_wisuda.png', service_name: 'Wisuda' },
  { id: 'd5', title: 'University Graduate Portrait', media_url: '/images/graduation.png', service_name: 'Wisuda' },
  { id: 'd6', title: 'Vintage Yearbook 90s', media_url: '/images/yearbook.png', service_name: 'Yearbook' },
  { id: 'd7', title: 'Glasshouse Wedding', media_url: '/images/wedding.png', service_name: 'Wedding' },
  { id: 'd8', title: 'Outdoor Graduation', media_url: '/images/video_wisuda.png', service_name: 'Wisuda' },
  { id: 'd9', title: 'Sleek Modern Yearbook', media_url: '/images/yearbook.png', service_name: 'Yearbook' },
  { id: 'd10', title: 'Intimate Wedding', media_url: '/images/wedding.png', service_name: 'Wedding' },
];

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalImage, setModalImage] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const [portfolios, svcs] = await Promise.all([
        getPortfolio(),
        getServices()
      ]);
      setItems(portfolios.sort((a,b) => a.order - b.order));
      setServices(svcs);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredItems = filter === 'all' ? items : items.filter(i => i.service_id === filter);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0f0f0f] pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-12">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#e8b84b]">Karya Kami</span>
            <h1 className="text-4xl md:text-6xl font-serif text-white font-bold">Portofolio</h1>
            <p className="text-[#888] max-w-2xl mx-auto text-sm md:text-base">Jelajahi rekam jejak mahakarya visual yang telah kami hasilkan dari berbagai kategori layanan.</p>
          </div>

          {/* Type Toggle (Foto / Video) */}
          <div className="flex justify-center mb-10">
            <div className="flex bg-[#1a1a1a] p-1 rounded-full border border-white/10">
              <button 
                onClick={() => setActiveTab('image')}
                className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'image' ? 'bg-[#e8b84b] text-black shadow-[0_0_15px_rgba(232,184,75,0.4)]' : 'text-white/60 hover:text-white'}`}
              >
                Foto
              </button>
              <button 
                onClick={() => setActiveTab('video')}
                className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'video' ? 'bg-[#e8b84b] text-black shadow-[0_0_15px_rgba(232,184,75,0.4)]' : 'text-white/60 hover:text-white'}`}
              >
                Video
              </button>
            </div>
          </div>

          {!loading && (
            <>
              {/* Category Filter */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${filter === 'all' ? 'bg-[#e8b84b] text-black shadow-[0_0_15px_rgba(232,184,75,0.4)]' : 'bg-[#1a1a1a] text-white/60 hover:text-white border border-white/10 hover:border-white/30'}`}
                >
                  Semua
                </button>
                {services.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setFilter(s.id)}
                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${filter === s.id ? 'bg-[#e8b84b] text-black shadow-[0_0_15px_rgba(232,184,75,0.4)]' : 'bg-[#1a1a1a] text-white/60 hover:text-white border border-white/10 hover:border-white/30'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Gallery */}
              {activeTab === 'image' ? (
                /* FOTO: Coverflow Carousel Layout */
                <div className="relative w-full flex flex-col items-center overflow-hidden py-4 md:py-12">
                  
                  {/* Coverflow Track */}
                  <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
                    {(() => {
                      const dbPhotos = filteredItems.filter(i => i.media_type === 'image').map(item => ({
                        ...item,
                        service_name: services.find(s => s.id === item.service_id)?.name || ''
                      }));
                      const displayPhotos = dbPhotos.length > 0 ? dbPhotos : DUMMY_PHOTOS;

                      return displayPhotos.map((item, index) => {
                        const distance = index - activeIndex;
                      
                      let zIndex = 0;
                      let scale = 0;
                      let translateX = 0;
                      let opacity = 0;
                      let blur = 0;
                      let pointerEvents = 'none';

                      if (distance === 0) {
                        zIndex = 30;
                        scale = 1;
                        opacity = 1;
                        translateX = 0;
                        pointerEvents = 'auto';
                      } else if (Math.abs(distance) === 1) {
                        zIndex = 20;
                        scale = 0.8;
                        opacity = 0.8;
                        translateX = distance > 0 ? 60 : -60;
                        blur = 1;
                        pointerEvents = 'auto';
                      } else if (Math.abs(distance) === 2) {
                        zIndex = 10;
                        scale = 0.6;
                        opacity = 0.5;
                        translateX = distance > 0 ? 110 : -110;
                        blur = 2;
                        pointerEvents = 'auto';
                      } else {
                        zIndex = 0;
                        scale = 0.4;
                        opacity = 0;
                        translateX = distance > 0 ? 150 : -150;
                      }

                      return (
                        <div 
                          key={item.id} 
                          onClick={() => {
                            if (distance === 0) setModalImage(item);
                            else setActiveIndex(index);
                          }}
                          className="absolute transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer"
                          style={{ 
                            zIndex, 
                            transform: `translateX(${translateX}%) scale(${scale})`, 
                            opacity, 
                            filter: `blur(${blur}px)`,
                            pointerEvents: pointerEvents as any,
                            width: '70%', 
                            maxWidth: '380px',
                            aspectRatio: '3/4'
                          }}
                        >
                          <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#1a1a1a] relative group border border-white/5">
                            <img 
                              src={item.media_url} 
                              alt={item.title} 
                              className="w-full h-full object-cover" 
                              onError={(e) => { e.currentTarget.src = '/images/yearbook.png'; }}
                            />
                            
                            {/* Minimal subtle hover for category name */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-xs uppercase tracking-[0.2em] text-white font-bold border border-white/30 px-4 py-2 backdrop-blur-sm text-center">
                                {item.service_name}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center gap-6 mt-16">
                    {(() => {
                      const dbPhotos = filteredItems.filter(i => i.media_type === 'image');
                      const displayPhotos = dbPhotos.length > 0 ? dbPhotos : DUMMY_PHOTOS;
                      
                      return (
                        <>
                          <button 
                            onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                            disabled={activeIndex === 0}
                          >
                            <ArrowLeft size={18} />
                          </button>
                          <button 
                            onClick={() => setActiveIndex(prev => Math.min(displayPhotos.length - 1, prev + 1))}
                            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                            disabled={activeIndex === displayPhotos.length - 1}
                          >
                            <ArrowRight size={18} />
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                /* VIDEO: Standard Grid Layout */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.filter(i => i.media_type === 'video').map((item, index) => {
                    const serviceName = services.find(s => s.id === item.service_id)?.name || '';
                    return (
                      <div 
                        key={item.id} 
                        className="group relative rounded-2xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] aspect-[16/9] shadow-lg"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <video src={item.media_url} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center">
                            <Play className="text-white ml-1 w-6 h-6" />
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] uppercase tracking-widest text-[#e8b84b] font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-[#e8b84b]/20">
                              {serviceName}
                            </span>
                            <Play className="w-3 h-3 text-white/50" />
                          </div>
                          <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredItems.length === 0 && (
                <div className="text-center py-24 border border-[#2a2a2a] border-dashed rounded-3xl bg-[#111]">
                  <p className="text-white/40">Belum ada karya yang diunggah untuk kategori ini.</p>
                </div>
              )}
            </>
          )}

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#e8b84b] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </main>

      {/* Image Modal Popup */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setModalImage(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <img 
              src={modalImage.media_url} 
              alt={modalImage.title} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
              onError={(e) => { e.currentTarget.src = '/images/yearbook.png'; }}
            />
            <div className="mt-6 text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#e8b84b] font-bold border border-[#e8b84b]/30 px-3 py-1 rounded-full mb-3 inline-block">
                {modalImage.service_name}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-2">{modalImage.title}</h3>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
