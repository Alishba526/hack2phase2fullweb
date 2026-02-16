'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
}

export function SearchAndFilter({ 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onFilterChange, 
  sortOption, 
  onSortChange 
}: SearchAndFilterProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border ${
              isFocused 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors`}
            placeholder="Search tasks..."
            aria-label="Search tasks"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white"
            aria-label="Filter by status"
          >
            <option value="">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white"
            aria-label="Sort by option"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="completed">Completed First</option>
            <option value="pending">Pending First</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}