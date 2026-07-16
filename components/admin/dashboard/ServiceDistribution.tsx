import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Project } from '@/lib/db';

export default function ServiceDistribution({ 
  projects, 
  isLoading 
}: { 
  projects: Project[], 
  isLoading: boolean 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-7 rounded-3xl bg-white border border-gray-100 shadow-sm relative overflow-hidden"
    >
      <div className="flex justify-between items-center border-b border-gray-200/40 pb-5 mb-5">
        <h3 className="text-lg font-bold font-heading flex items-center gap-3">
          <div className="p-2 bg-accent-secondary/10 rounded-xl">
            <TrendingUp className="h-5 w-5 text-accent-secondary" />
          </div>
          Distribusi Layanan
        </h3>
      </div>
      
      {isLoading ? (
        <div className="space-y-6 py-2">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-50 animate-pulse rounded" />
                <div className="h-4 w-12 bg-gray-50 animate-pulse rounded" />
              </div>
              <div className="h-2 w-full bg-gray-50 animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center py-10 px-4"
        >
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-50 rounded-full flex items-center justify-center shadow-sm">
            <TrendingUp className="h-5 w-5 text-gray-500/50" />
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">Data Belum Tersedia</p>
          <p className="text-xs text-gray-500">Distribusi statistik layanan akan muncul setelah ada proyek masuk ke sistem.</p>
        </motion.div>
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">Statistik proyek akan ditampilkan di sini.</p>
        </div>
      )}
    </motion.div>
  );
}
