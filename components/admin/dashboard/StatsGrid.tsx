import { motion } from 'framer-motion';

interface Stat {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  gradient: string;
}

export default function StatsGrid({ stats, isLoading }: { stats: Stat[], isLoading: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className={`relative p-6 rounded-3xl bg-gradient-to-b ${stat.gradient} to-bg-surface border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group`}
        >
          <div className={`absolute top-0 left-0 w-full h-1 ${stat.border} opacity-80`} />
          
          <div className="flex justify-between items-start">
            <div className="space-y-3 z-10">
              <p className="text-[11px] text-text-secondary uppercase tracking-widest font-bold">{stat.title}</p>
              
              {isLoading ? (
                <div className="h-8 w-24 bg-bg-elevated animate-pulse rounded-lg" />
              ) : (
                <h3 className="text-3xl font-bold font-heading text-text-primary">{stat.value}</h3>
              )}
              
              <p className="text-[10px] text-text-secondary font-medium">{stat.subtitle}</p>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner group-hover:scale-110 transition-transform duration-300 z-10`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          
          {/* Decorative background circle */}
          <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${stat.border} opacity-[0.03] blur-2xl group-hover:opacity-10 transition-opacity duration-300`} />
        </motion.div>
      ))}
    </div>
  );
}
