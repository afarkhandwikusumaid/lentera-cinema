'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Flame,
  LayoutDashboard,
  Calendar,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Users,
  Briefcase
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState('Super Admin');
  const pathname = usePathname();
  const router = useRouter();

  // Simple security check for demo purposes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('lc_admin_logged_in');
      if (isLoggedIn !== 'true' && pathname !== '/adminlentera') {
        router.push('/adminlentera');
      }
      const savedName = localStorage.getItem('lc_admin_name');
      if (savedName) {
        setAdminName(savedName);
      }
    }
  }, [pathname, router]);

  const navGroups = [
    {
      title: 'UTAMA',
      links: [
        { name: 'Dashboard', href: '/adminlentera/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'LAYANAN & TIM',
      links: [
        { name: 'Layanan', href: '/adminlentera/services', icon: Layers },
        { name: 'Jadwal & Tim', href: '/adminlentera/schedules', icon: Calendar },
      ]
    },
    {
      title: 'PORTOFOLIO & KLIEN',
      links: [
        { 
          name: 'Portofolio', 
          icon: ImageIcon,
          subLinks: [
            { name: 'Foto', href: '/adminlentera/portfolio/foto' },
            { name: 'Video', href: '/adminlentera/portfolio/video' }
          ]
        },
        { name: 'Testimoni Reguler', href: '/adminlentera/testimonials', icon: MessageSquare },
        { name: 'Klien Sekolah', href: '/adminlentera/clients', icon: Users },
        { name: 'Mitra & Brand', href: '/adminlentera/brands', icon: Briefcase },
      ]
    },
    {
      title: 'SISTEM',
      links: [
        { name: 'Pengaturan Web', href: '/adminlentera/settings', icon: Settings },
      ]
    }
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lc_admin_logged_in');
      router.push('/adminlentera');
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-30">
        <Link href="/adminlentera/dashboard" className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#c29631] text-white">
            <Flame className="h-5 w-5 fill-current" />
          </span>
          <span className="font-serif font-bold text-lg tracking-tight text-gray-900">
            Lentera <span className="text-[#c29631] italic">Admin</span>
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-gray-500 bg-gray-50 border border-gray-200 transition-colors focus:outline-none"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar - Desktop and Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 md:sticky md:top-0 md:h-screen md:flex md:flex-col md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3 px-2 mb-10 shrink-0">
            <span className="p-2 rounded-xl bg-[#c29631] text-white">
              <Flame className="h-5 w-5 fill-current" />
            </span>
            <span className="font-serif text-xl font-bold tracking-tight text-gray-900">
              Lentera <span className="text-[#c29631] italic">Admin</span>
            </span>
          </div>

          {/* Nav Menu */}
          <div className="flex-1 overflow-y-auto space-y-8 pr-2 pb-4 min-h-0">
            {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {group.title}
                  </h3>
                  <nav className="flex flex-col gap-1">
                    {group.links.map((link) => {
                      const Icon = link.icon;
                      
                      if (link.subLinks) {
                        const isGroupActive = link.subLinks.some(sub => pathname.startsWith(sub.href));
                        return (
                          <div key={link.name} className="flex flex-col">
                            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                              isGroupActive ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              <Icon className={`h-5 w-5 ${isGroupActive ? 'text-[#c29631]' : 'text-gray-400'}`} strokeWidth={2} />
                              {link.name}
                            </div>
                            <div className="ml-6 pl-4 border-l-2 border-gray-100 flex flex-col gap-1 mt-1">
                              {link.subLinks.map(sub => {
                                const isSubActive = pathname === sub.href;
                                return (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-300 relative ${
                                      isSubActive
                                        ? 'bg-[#c29631]/10 text-[#c29631] font-bold'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                  >
                                    {isSubActive && (
                                      <span className="absolute -left-[19px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#c29631] border-2 border-white ring-2 ring-white" />
                                    )}
                                    {sub.name}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${active ? 'text-[#c29631]' : 'text-gray-400'}`} strokeWidth={2} />
                          {link.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

          {/* User profile & logout */}
          <div className="space-y-3 pt-6 border-t border-gray-100 mt-4 shrink-0">
            <div className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-3 transition-colors">
              <div className="h-10 w-10 rounded-full bg-[#c29631]/10 flex items-center justify-center">
                <User className="h-5 w-5 text-[#c29631]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-gray-900 truncate">{adminName}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Administrator</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/75 z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-gray-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
