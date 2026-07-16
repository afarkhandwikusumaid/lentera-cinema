import Link from 'next/link';
import { Flame, User, LogOut, type LucideIcon } from 'lucide-react';

interface NavGroup {
  title: string;
  links: Array<{
    name: string;
    href?: string;
    icon: LucideIcon;
    subLinks?: Array<{ name: string; href: string; }>;
  }>;
}

export default function AdminSidebar({
  isOpen,
  setIsOpen,
  pathname,
  navGroups,
  adminName,
  handleLogout
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  pathname: string;
  navGroups: NavGroup[];
  adminName: string;
  handleLogout: () => void;
}) {
  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-[#111]/90 backdrop-blur-xl border-r border-[#222] z-40 transform transition-transform duration-300 md:sticky md:top-0 md:h-screen md:flex md:flex-col md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <div className="hidden md:flex items-center gap-3 px-2 mb-10 shrink-0">
          <span className="p-2 rounded-xl bg-gradient-to-br from-[#e8b84b] to-[#c29631] text-black shadow-lg shadow-[#c29631]/20">
            <Flame className="h-5 w-5 fill-current" />
          </span>
          <span className="font-serif text-xl font-bold tracking-tight text-white">
            Lentera <span className="text-[#c29631] italic">Admin</span>
          </span>
        </div>

        {/* Nav Menu */}
        <div className="flex-1 overflow-y-auto space-y-8 pr-2 pb-4 min-h-0 scrollbar-hide">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-[#666]">
                {group.title}
              </h3>
              <nav className="flex flex-col gap-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  
                  if (link.subLinks) {
                    const isGroupActive = link.subLinks.some(sub => pathname.startsWith(sub.href));
                    return (
                      <div key={link.name} className="flex flex-col">
                        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] transition-all duration-300 ${
                          isGroupActive ? 'text-white font-bold' : 'text-[#888] font-semibold hover:text-white hover:bg-[#222]'
                        }`}>
                          <Icon className={`h-5 w-5 ${isGroupActive ? 'text-white' : 'text-[#555]'}`} strokeWidth={isGroupActive ? 2.5 : 2} />
                          {link.name}
                        </div>
                        <div className="ml-6 pl-4 border-l-2 border-[#333] flex flex-col gap-1 mt-1">
                          {link.subLinks.map(sub => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setIsOpen(false)}
                                className={`px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-300 relative ${
                                  isSubActive
                                    ? 'bg-[#f3e8c8] text-black font-bold'
                                    : 'text-[#888] hover:text-white hover:bg-[#222]'
                                }`}
                              >
                                {isSubActive && (
                                  <span className="absolute -left-[19px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border-2 border-[#111] ring-2 ring-[#111]" />
                                )}
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  const active = link.href ? isActive(link.href) : false;
                  return (
                    <Link
                      key={link.name}
                      href={link.href || '#'}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] transition-all duration-300 relative group ${
                        active
                          ? 'bg-[#f3e8c8] text-black font-bold shadow-sm'
                          : 'text-[#888] font-semibold hover:bg-[#222] hover:text-white'
                      }`}
                    >
                      <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? 'text-black' : 'text-[#555]'}`} strokeWidth={active ? 2.5 : 2} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User profile & logout */}
        <div className="space-y-3 pt-6 border-t border-[#222] mt-4 shrink-0">
          <div className="p-3 rounded-2xl bg-[#0a0a0a] border border-[#222] shadow-sm flex items-center gap-3 transition-colors hover:border-[#333]">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#e8b84b]/20 to-[#c29631]/10 border border-[#e8b84b]/30 flex items-center justify-center">
              <User className="h-5 w-5 text-[#e8b84b]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white truncate">{adminName}</p>
              <p className="text-[10px] uppercase tracking-wider text-[#888] font-semibold">Administrator</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-[#888] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
