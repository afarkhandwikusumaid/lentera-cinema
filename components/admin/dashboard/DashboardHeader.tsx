import { motion } from 'framer-motion';
import { Sparkles, Calendar as CalendarIcon } from 'lucide-react';

export default function DashboardHeader({ today }: { today: Date }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-6 rounded-3xl border border-gray-100 backdrop-blur-xl shadow-sm"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-accent-primary" />
          <h1 className="text-3xl font-bold tracking-tight font-heading bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
        </div>
        <p className="text-sm text-gray-500">Pantau performa dan jadwal Lentera Cinema secara real-time.</p>
      </div>
      <div className="flex items-center gap-3 text-sm bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
        <CalendarIcon className="w-4 h-4 text-accent-primary" />
        <span className="text-gray-500">
          Hari Ini: <strong className="text-gray-900 ml-1">{today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </span>
      </div>
    </motion.div>
  );
}
