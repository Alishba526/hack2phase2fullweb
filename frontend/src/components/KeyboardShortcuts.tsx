'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface KeyboardShortcutsProps {
  onAddTodo: () => void;
  onSearchFocus: () => void;
}

export function KeyboardShortcuts({ onAddTodo, onSearchFocus }: KeyboardShortcutsProps) {
  return (
    <div className="hidden md:block fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-xs">
      <h4 className="font-medium text-gray-900 mb-2">Keyboard Shortcuts</h4>
      <ul className="text-sm text-gray-600 space-y-1">
        <li className="flex items-center">
          <kbd className="bg-gray-100 px-2 py-1 rounded mr-2">⌘</kbd>
          <kbd className="bg-gray-100 px-2 py-1 rounded mr-2">Shift</kbd>
          <kbd className="bg-gray-100 px-2 py-1 rounded mr-2">N</kbd>
          <span>New Task</span>
        </li>
        <li className="flex items-center">
          <kbd className="bg-gray-100 px-2 py-1 rounded mr-2">⌘</kbd>
          <kbd className="bg-gray-100 px-2 py-1 rounded mr-2">K</kbd>
          <span>Focus Search</span>
        </li>
      </ul>
    </div>
  );
}