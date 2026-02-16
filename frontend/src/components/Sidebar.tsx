'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentUser: any;
  onLogout: () => void;
}

export function Sidebar({ currentUser, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed on mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
  ];

  // Close mobile menu when navigating
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname, isMobileMenuOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-md text-gray-700"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isMobileMenuOpen ? 0 : -300 }}
        className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white shadow-lg z-40 md:hidden overflow-y-auto"
      >
        <nav className="py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="ml-3 font-medium">{item.name}</span>
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
              {(currentUser?.first_name || currentUser?.email)?.charAt(0)?.toUpperCase()}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.first_name || currentUser?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="mt-3 w-full text-left text-sm text-red-600 hover:text-red-800 font-medium py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Desktop sidebar */}
      <motion.aside
        initial={{ width: 64 }}
        animate={{ width: isExpanded ? 240 : 64 }}
        className={`bg-white shadow-lg h-[calc(100vh-4rem)] sticky top-16 z-10 flex flex-col border-r border-gray-200 hidden md:flex ${
          isExpanded ? 'min-w-[240px]' : 'min-w-[64px]'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? '◀' : '▶'}
          </motion.button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isExpanded && (
                      <span className="ml-3 font-medium">{item.name}</span>
                    )}
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
              {(currentUser?.first_name || currentUser?.email)?.charAt(0)?.toUpperCase()}
            </div>
            {isExpanded && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser?.first_name || currentUser?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email}
                </p>
              </div>
            )}
          </div>

          {isExpanded && (
            <button
              onClick={onLogout}
              className="mt-3 w-full text-left text-sm text-red-600 hover:text-red-800 font-medium py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}