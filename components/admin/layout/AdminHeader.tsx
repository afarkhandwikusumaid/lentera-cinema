import Link from 'next/link';
import { Flame, Menu, X } from 'lucide-react';

export default function AdminHeader({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  return (
    <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[#111] border-b border-[#222] z-30 shadow-lg">
      <Link href="/adminlentera/dashboard" className="flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-gradient-to-br from-[#e8b84b] to-[#c29631] text-black shadow-lg shadow-[#c29631]/20">
          <Flame className="h-5 w-5 fill-current" />
        </span>
        <span className="font-serif font-bold text-lg tracking-tight text-white">
          Lentera <span className="text-[#c29631] italic">Admin</span>
        </span>
      </Link>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-300 bg-[#222] border border-[#333] hover:bg-[#333] hover:text-white transition-all focus:outline-none"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </header>
  );
}
