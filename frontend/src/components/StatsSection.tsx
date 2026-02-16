'use client';

import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: string;
}

export function StatsCard({ title, value, subtitle, icon, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface ProgressBarProps {
  percentage: number;
  label: string;
  color: string;
}

export function ProgressBar({ percentage, label, color }: ProgressBarProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div 
          className={`h-2.5 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        ></motion.div>
      </div>
    </div>
  );
}

interface StatsSectionProps {
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
}

export function StatsSection({ totalTodos, completedTodos, pendingTodos }: StatsSectionProps) {
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Task Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Tasks" 
          value={totalTodos} 
          subtitle="All your tasks" 
          icon="📋" 
          color="bg-blue-100 text-blue-600" 
        />
        <StatsCard 
          title="Completed" 
          value={completedTodos} 
          subtitle="Finished tasks" 
          icon="✅" 
          color="bg-green-100 text-green-600" 
        />
        <StatsCard 
          title="Pending" 
          value={pendingTodos} 
          subtitle="To be completed" 
          icon="⏳" 
          color="bg-yellow-100 text-yellow-600" 
        />
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <ProgressBar 
          percentage={completionRate} 
          label="Completion Rate" 
          color="bg-blue-500" 
        />
        <div className="flex justify-between text-sm text-gray-600 mt-4">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
    </motion.div>
  );
}