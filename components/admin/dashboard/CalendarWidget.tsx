import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarWidget({ 
  today, 
  monthNames, 
  month, 
  year, 
  calendarDays 
}: { 
  today: Date, 
  monthNames: string[], 
  month: number, 
  year: number, 
  calendarDays: (number | null)[] 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="p-7 rounded-3xl bg-bg-surface border border-border/50 shadow-sm flex flex-col h-full"
    >
      <div className="border-b border-border/40 pb-5 mb-5 flex-shrink-0">
        <h3 className="text-base font-bold font-heading text-center flex items-center justify-center gap-2">
          <CalendarIcon className="w-5 h-5 text-accent-primary" />
          Kalender {monthNames[month]} {year}
        </h3>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-text-secondary uppercase mb-2 flex-shrink-0">
        <span>Sen</span>
        <span>Sel</span>
        <span>Rab</span>
        <span>Kam</span>
        <span>Jum</span>
        <span className="text-accent-primary">Sab</span>
        <span className="text-danger">Min</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs flex-grow content-start">
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const isToday = day === today.getDate();

          let dayBg = 'text-text-secondary hover:bg-bg-elevated';

          if (isToday) {
            dayBg = 'bg-accent-primary/10 text-accent-primary font-bold border-accent-primary/30 ring-1 ring-accent-primary/20';
          }

          return (
            <div
              key={`day-${day}`}
              className={`aspect-square rounded-xl border border-transparent flex items-center justify-center cursor-pointer transition-all duration-200 relative group ${dayBg}`}
            >
              <span>{day}</span>
            </div>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="pt-5 mt-auto border-t border-border/40 text-[10px] text-text-secondary space-y-2.5">
        <div className="flex items-center gap-2 bg-bg-elevated/30 p-1.5 rounded-lg border border-border/20">
          <span className="w-3.5 h-3.5 rounded-md bg-success shadow-sm shadow-success/20 flex-shrink-0" />
          <span className="font-medium">Terkonfirmasi (Confirmed)</span>
        </div>
        <div className="flex items-center gap-2 bg-bg-elevated/30 p-1.5 rounded-lg border border-border/20">
          <span className="w-3.5 h-3.5 rounded-md bg-warning/30 border border-warning/40 flex-shrink-0" />
          <span className="font-medium">Menunggu (Pending)</span>
        </div>
        <div className="flex items-center gap-2 bg-bg-elevated/30 p-1.5 rounded-lg border border-border/20">
          <span className="w-3.5 h-3.5 rounded-md bg-danger shadow-sm shadow-danger/20 flex-shrink-0 flex items-center justify-center ring-2 ring-danger/30">
            <span className="w-1 h-1 bg-white rounded-full" />
          </span>
          <span className="font-medium">Bentrok (Lebih dari 1 confirmed)</span>
        </div>
      </div>
    </motion.div>
  );
}
