import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, FolderOpen } from 'lucide-react';
import { Project } from '@/lib/db';

export default function UpcomingSchedules({ 
  upcomingEvents, 
  isLoading, 
  formatCurrency 
}: { 
  upcomingEvents: Project[], 
  isLoading: boolean,
  formatCurrency: (amount: number) => string 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="p-7 rounded-3xl bg-bg-surface border border-border/50 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-50" />
      
      <div className="flex justify-between items-center border-b border-border/40 pb-5 mb-5">
        <h3 className="text-lg font-bold font-heading flex items-center gap-3">
          <div className="p-2 bg-accent-primary/10 rounded-xl">
            <CalendarIcon className="h-5 w-5 text-accent-primary" />
          </div>
          Jadwal Terdekat
        </h3>
        <span className="text-xs font-semibold px-3 py-1 bg-bg-elevated rounded-full border border-border/50 text-text-secondary shadow-sm">
          7 Hari ke Depan
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-bg-elevated/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : upcomingEvents.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center py-16 px-4 bg-bg-elevated/30 rounded-2xl border border-dashed border-border/60"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-bg-surface rounded-full flex items-center justify-center border border-border/50 shadow-sm">
            <FolderOpen className="h-8 w-8 text-text-secondary/60" />
          </div>
          <h4 className="text-base font-bold text-text-primary mb-1">Belum Ada Proyek</h4>
          <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
            Saat ini tidak ada proyek aktif.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {upcomingEvents.map((event, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
              key={event.id} 
              className="p-4 rounded-2xl bg-bg-elevated/50 hover:bg-bg-elevated border border-border/40 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">{event.name}</span>
                  <span className="text-[10px] bg-accent-primary/10 px-2 py-0.5 rounded-md border border-accent-primary/20 text-accent-primary font-bold">
                    Klien: {event.client_name}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary font-medium">
                  {formatCurrency(event.total_value)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
