'use client';

import { useState, useRef, useImperativeHandle, forwardRef, ForwardedRef } from 'react';
import { motion } from 'framer-motion';
import { todoService } from '../services/todo';
import { Todo } from '../types/todo';

interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
}

export interface TodoFormHandles {
  focus: () => void;
}

export const TodoForm = forwardRef<TodoFormHandles, TodoFormProps>(({ onAddTodo }, ref) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Expose focus function to parent component
  useImperativeHandle(ref, () => ({
    focus: () => {
      titleInputRef.current?.focus();
    }
  }), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const newTodo = {
        title: title.trim(),
        description: description.trim(),
      };

      const createdTodo = await todoService.createTodo(newTodo);
      onAddTodo(createdTodo);

      // Reset form
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error('Error adding todo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="mb-2">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h3>
      </div>

      {error && typeof error === 'string' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
          Task Title *
        </label>
        <input
          ref={titleInputRef}
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Additional details..."
          rows={2}
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 px-4 rounded-xl text-white font-medium shadow-md transition-all ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
        }`}
      >
        {isSubmitting ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
          ></motion.span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )}
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </motion.button>
    </motion.form>
  );
});

TodoForm.displayName = 'TodoForm';