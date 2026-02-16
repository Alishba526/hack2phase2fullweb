'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { todoService } from '../services/todo';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [error, setError] = useState('');

  const handleToggleComplete = async () => {
    try {
      const updatedTodo = await todoService.updateTodo(todo.id, {
        ...todo,
        is_completed: !todo.is_completed
      });
      onUpdate(updatedTodo);
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedTodo = await todoService.updateTodo(todo.id, {
        title: editTitle,
        description: editDescription,
        is_completed: todo.is_completed
      });
      onUpdate(updatedTodo);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error saving todo:', err);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
    setError('');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        const success = await todoService.deleteTodo(todo.id);
        if (success) {
          onDelete(todo.id);
        } else {
          setError('Failed to delete todo. Please try again.');
        }
      } catch (err) {
        setError('Failed to delete todo. Please try again.');
        console.error('Error deleting todo:', err);
      }
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-4 sm:p-5 shadow-md ${
        todo.is_completed
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
          : 'bg-gradient-to-r from-white to-blue-50 border border-gray-100'
      }`}
    >
      {error && typeof error === 'string' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Todo title..."
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Description (optional)..."
              rows={2}
            />
            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl shadow-md transition-all text-sm"
              >
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl shadow-md transition-all text-sm"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="todo-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col sm:flex-row sm:items-start gap-3"
          >
            <div className="flex items-start space-x-2 sm:space-x-4 flex-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-1"
              >
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={handleToggleComplete}
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </motion.div>

              <div className="flex-1">
                <motion.h3
                  className={`font-semibold text-base sm:text-lg ${
                    todo.is_completed
                      ? 'line-through text-gray-500'
                      : 'text-gray-800'
                  }`}
                  animate={{ color: todo.is_completed ? '#9CA3AF' : '#1F2937' }}
                >
                  {todo.title}
                </motion.h3>

                {todo.description && (
                  <motion.p
                    className={`mt-1 sm:mt-2 text-sm sm:text-base ${
                      todo.is_completed ? 'line-through' : ''
                    }`}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                  >
                    {todo.description}
                  </motion.p>
                )}

                <div className="mt-2 flex items-center text-xs text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Created: {new Date(todo.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <motion.div
              className="flex space-x-2 justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#3B82F6" }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
                title="Edit todo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#EF4444" }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                title="Delete todo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}