'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { todoService } from '../../../services/todo';
import { authService } from '../../../services/auth';
import { LoadingState, ErrorState } from '../../../components/LoadingErrorStates';
import { Todo } from '../../../types/todo';

export default function AnalyticsPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    avgCompletionTime: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const user = await authService.getCurrentUser();
        setCurrentUser(user);

        // Fetch todos
        const todosData = await todoService.getTodos();
        setTodos(todosData);

        // Calculate stats
        const total = todosData.length;
        const completed = todosData.filter(todo => todo.is_completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Calculate average completion time (in days)
        let totalTime = 0;
        let completedCount = 0;
        todosData.forEach(todo => {
          if (todo.is_completed && todo.updated_at && todo.created_at) {
            const created = new Date(todo.created_at);
            const updated = new Date(todo.updated_at);
            const diffTime = Math.abs(updated.getTime() - created.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            totalTime += diffDays;
            completedCount++;
          }
        });
        const avgCompletionTime = completedCount > 0 ? Math.round(totalTime / completedCount) : 0;

        setStats({
          total,
          completed,
          pending,
          completionRate,
          avgCompletionTime,
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      fetchData();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    const fetchData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        const todosData = await todoService.getTodos();
        setTodos(todosData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  if (!authService.isAuthenticated()) {
    return null; // Redirect handled in useEffect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <LoadingState message="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <ErrorState message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Track your productivity and todo patterns</p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="text-blue-800 text-3xl font-bold">{stats.total}</div>
          <div className="text-blue-600 mt-1">Total Todos</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm border border-green-100">
          <div className="text-green-800 text-3xl font-bold">{stats.completed}</div>
          <div className="text-green-600 mt-1">Completed</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-sm border border-yellow-100">
          <div className="text-yellow-800 text-3xl font-bold">{stats.pending}</div>
          <div className="text-yellow-600 mt-1">Pending</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-sm border border-purple-100">
          <div className="text-purple-800 text-3xl font-bold">{stats.completionRate}%</div>
          <div className="text-purple-600 mt-1">Completion Rate</div>
        </div>
      </motion.div>

      {/* Additional Metrics */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-gray-500 text-sm">Avg. Completion Time</div>
            <div className="text-2xl font-bold mt-1">{stats.avgCompletionTime} <span className="text-gray-500 text-base">days</span></div>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-gray-500 text-sm">Tasks This Week</div>
            <div className="text-2xl font-bold mt-1">0</div>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-gray-500 text-sm">Peak Productivity Day</div>
            <div className="text-2xl font-bold mt-1">-</div>
          </div>
        </div>
      </motion.div>

      {/* Productivity Chart Placeholder */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Productivity Over Time</h2>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 min-h-[300px] flex items-center justify-center border border-gray-100">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">Analytics Visualization</h3>
            <p className="text-gray-500 mt-2">Detailed charts showing your productivity trends over time</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}