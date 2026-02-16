'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/auth';
import { todoService } from '../../services/todo';
import { TodoForm, TodoFormHandles } from '../../components/TodoForm';
import { TodoItem } from '../../components/TodoItem';
import { Sidebar } from '../../components/Sidebar';
import { StatsSection } from '../../components/StatsSection';
import { SearchAndFilter } from '../../components/SearchAndFilter';
import { Footer } from '../../components/Footer';
import { LoadingState, ErrorState } from '../../components/LoadingErrorStates';
import { KeyboardShortcuts } from '../../components/KeyboardShortcuts';
import { AccessibilityToolbar, useAccessibility } from '../../components/Accessibility';
import { Todo } from '../../types/todo';

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const todoFormRef = useRef<TodoFormHandles>(null);

  // Initialize accessibility context
  const { highContrast } = useAccessibility();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + N to add new todo
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        if (todoFormRef.current) {
          todoFormRef.current.focus();
        }
      }

      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const fetchData = async () => {
        try {
          // Get current user
          const user = await authService.getCurrentUser();
          setCurrentUser(user);

          // Fetch todos
          const todosData = await todoService.getTodos();
          setTodos(todosData);
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
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...todos];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(term) ||
        (todo.description && todo.description.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (filterStatus) {
      if (filterStatus === 'completed') {
        result = result.filter(todo => todo.is_completed);
      } else if (filterStatus === 'pending') {
        result = result.filter(todo => !todo.is_completed);
      }
    }

    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'completed':
        result.sort((a, b) => Number(b.is_completed) - Number(a.is_completed));
        break;
      case 'pending':
        result.sort((a, b) => Number(a.is_completed) - Number(b.is_completed));
        break;
    }

    setFilteredTodos(result);
  }, [todos, searchTerm, filterStatus, sortOption]);

  const addTodo = async (newTodo: Todo) => {
    try {
      setTodos([newTodo, ...todos]);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    try {
      const updated = await todoService.updateTodo(updatedTodo.id, {
        title: updatedTodo.title,
        description: updatedTodo.description,
        is_completed: updatedTodo.is_completed
      });

      setTodos(todos.map(todo =>
        todo.id === updated.id ? updated : todo
      ));
    } catch (err) {
      console.error('Error updating todo:', err);
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const success = await todoService.deleteTodo(id);
      if (success) {
        // Update the state to remove the deleted todo
        setTodos(todos.filter(todo => todo.id !== id));
        // Also update filtered todos to maintain consistency
        setFilteredTodos(filteredTodos.filter(todo => todo.id !== id));
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      // Don't show error for 404 since it might mean the todo was already deleted
      if (err instanceof Error && err.message.includes('404')) {
        // Todo was already deleted, just update the local state
        setTodos(todos.filter(todo => todo.id !== id));
        setFilteredTodos(filteredTodos.filter(todo => todo.id !== id));
      } else {
        setError(err instanceof Error ? err.message : 'Failed to delete todo');
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

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

  const handleSearchFocus = () => {
    searchInputRef.current?.focus();
  };

  // Calculate stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.is_completed).length;
  const pendingTodos = totalTodos - completedTodos;

  if (typeof window !== 'undefined' && !authService.isAuthenticated()) {
    return null; // Redirect handled in useEffect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <LoadingState message="Loading your dashboard..." />
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
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col ${highContrast ? 'high-contrast-mode' : ''}`}>
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Sidebar - Make it collapsible on mobile */}
          <div className="md:hidden">
            <Sidebar currentUser={currentUser} onLogout={handleLogout} />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full pt-16"> {/* Added pt-16 to account for fixed navbar */}
            <div className="max-w-6xl mx-auto w-full">
              {/* Stats Section */}
              <StatsSection
                totalTodos={totalTodos}
                completedTodos={completedTodos}
                pendingTodos={pendingTodos}
              />

              {/* Search and Filter */}
              <SearchAndFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />

              {/* Add Todo Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6 sm:mb-8"
              >
                <TodoForm ref={todoFormRef} onAddTodo={addTodo} />
              </motion.div>

              {/* Todo List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Your Tasks</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto">
                    {filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>

                <AnimatePresence>
                  {filteredTodos.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 sm:py-12 bg-white rounded-2xl shadow-sm border border-gray-100"
                    >
                      <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-base sm:text-lg">
                        {searchTerm || filterStatus ? 'No tasks match your filters' : 'No tasks yet. Add one above to get started!'}
                      </p>
                    </motion.div>
                  ) : (
                    <ul className="space-y-3 sm:space-y-4">
                      <AnimatePresence>
                        {filteredTodos.map((todo, index) => (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            onUpdate={updateTodo}
                            onDelete={deleteTodo}
                          />
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer />

        {/* Keyboard Shortcuts Helper - Hide on mobile */}
        <div className="hidden md:block fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-xs z-50">
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

        {/* Accessibility Toolbar */}
        <AccessibilityToolbar />
      </div>
  );
}