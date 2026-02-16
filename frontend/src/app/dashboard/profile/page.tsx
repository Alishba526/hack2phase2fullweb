'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../../../services/auth';
import { LoadingState, ErrorState } from '../../../components/LoadingErrorStates';

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  created_at: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [avatarColor, setAvatarColor] = useState('from-blue-500 to-purple-500');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        setFormData({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
        });

        // Set a random avatar color based on user data
        const colors = [
          'from-blue-500 to-purple-500',
          'from-green-500 to-teal-500',
          'from-purple-500 to-pink-500',
          'from-yellow-500 to-orange-500',
          'from-red-500 to-pink-500',
        ];
        const colorIndex = user.id ? user.id.charCodeAt(0) % colors.length : 0;
        setAvatarColor(colors[colorIndex]);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      fetchUserData();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // In a real implementation, we would call the API to update user profile
      // For now, we'll just simulate the update
      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update current user data
      setCurrentUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          first_name: formData.firstName,
          last_name: formData.lastName,
        };
      });

      setEditing(false);
      setError(null);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form data to current user data
    setFormData({
      firstName: currentUser?.first_name || '',
      lastName: currentUser?.last_name || '',
      email: currentUser?.email || '',
    });
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        setFormData({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
        });
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  };

  if (!authService.isAuthenticated()) {
    return null; // Redirect handled in useEffect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <LoadingState message="Loading profile..." />
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <ErrorState message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8 text-center"
      >
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className={`bg-gradient-to-r ${avatarColor} w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg`}>
            {(currentUser?.first_name || currentUser?.email)?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          {currentUser?.first_name || currentUser?.email?.split('@')[0]}'s Profile
        </h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your personal information</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8"
      >
        {editing ? (
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed text-sm sm:text-base"
                  disabled
                />
                <p className="mt-1 text-xs sm:text-sm text-gray-500">Email cannot be changed</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md text-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-4 sm:gap-8 mb-6 sm:mb-8">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">First Name</h3>
                <p className="text-base sm:text-lg font-medium text-gray-900">{currentUser?.first_name || '-'}</p>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Last Name</h3>
                <p className="text-base sm:text-lg font-medium text-gray-900">{currentUser?.last_name || '-'}</p>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Email Address</h3>
                <p className="text-base sm:text-lg font-medium text-gray-900">{currentUser?.email || '-'}</p>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Member Since</h3>
                <p className="text-base sm:text-lg font-medium text-gray-900">
                  {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setEditing(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md text-sm"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 gap-4 sm:gap-6 mt-6 sm:mt-8"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 shadow-sm border border-blue-100">
          <div className="text-blue-800 text-2xl sm:text-3xl font-bold">24</div>
          <div className="text-blue-600 mt-1 text-sm sm:text-base">Total Todos</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 shadow-sm border border-green-100">
          <div className="text-green-800 text-2xl sm:text-3xl font-bold">18</div>
          <div className="text-green-600 mt-1 text-sm sm:text-base">Completed</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 sm:p-6 shadow-sm border border-purple-100">
          <div className="text-purple-800 text-2xl sm:text-3xl font-bold">75%</div>
          <div className="text-purple-600 mt-1 text-sm sm:text-base">Completion Rate</div>
        </div>
      </motion.div>
    </div>
  );
}