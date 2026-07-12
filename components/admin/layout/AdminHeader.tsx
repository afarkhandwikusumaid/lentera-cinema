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
  );
}
