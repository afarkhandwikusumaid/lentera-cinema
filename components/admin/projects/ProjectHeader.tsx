import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Project } from '@/lib/db';

export default function ProjectHeader({
  project,
  totalPaid,
  totalExpense,
  netProfit,
  formatCurrency
}: {
  project: Project;
  totalPaid: number;
  totalExpense: number;
  netProfit: number;
  formatCurrency: (amount: number) => string;
}) {
  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Link href="/adminlentera/projects" className="p-2 bg-bg-surface rounded-lg border border-border text-text-secondary hover:text-[#c29631]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">{project.name}</h1>
          <p className="text-sm text-text-secondary">Klien: {project.client_name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-surface p-4 rounded-2xl border border-border/50 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-text-secondary/70 mb-1">Total Nilai Proyek</p>
          <h3 className="text-xl font-bold text-text-primary">{formatCurrency(project.total_value)}</h3>
        </div>
        <div className="bg-bg-surface p-4 rounded-2xl border border-border/50 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-text-secondary/70 mb-1">Sudah Dibayar</p>
          <h3 className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</h3>
        </div>
        <div className="bg-bg-surface p-4 rounded-2xl border border-border/50 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-text-secondary/70 mb-1">Pengeluaran Tim</p>
          <h3 className="text-xl font-bold text-red-500">{formatCurrency(totalExpense)}</h3>
        </div>
        <div className="bg-bg-surface p-4 rounded-2xl border border-border/50 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-text-secondary/70 mb-1">Profit Bersih Sementara</p>
          <h3 className="text-xl font-bold text-[#c29631]">{formatCurrency(netProfit)}</h3>
        </div>
      </div>
    </>
  );
}
