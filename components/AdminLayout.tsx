'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Users,
  Briefcase,
  Receipt
} from 'lucide-react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState('Super Admin');
  const pathname = usePathname();
  const router = useRouter();

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
        { name: 'Proyek Klien', href: '/adminlentera/projects', icon: Briefcase },
      ]
    },
    {
      title: 'KEUANGAN',
      links: [
        { name: 'Pengeluaran Operasional', href: '/adminlentera/expenses', icon: Receipt },
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
        { name: 'Instansi Sekolah', href: '/adminlentera/clients', icon: Users },
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900 selection:bg-[#c29631]/30">
      <AdminHeader isOpen={isOpen} setIsOpen={setIsOpen} />

      <AdminSidebar 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        pathname={pathname}
        navGroups={navGroups}
        adminName={adminName}
        handleLogout={handleLogout}
      />

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-gray-50 relative" style={{ '--border': '#e5e7eb' } as React.CSSProperties}>
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

