'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/auth';

interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already authenticated on initial load
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated() && !authService.isTokenExpired()) {
          await getCurrentUser();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    
    if (result.success && result.user) {
      setUser(result.user);
    }
    
    return result;
  };

  const register = async (userData: { email: string; password: string; firstName?: string; lastName?: string }) => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const getCurrentUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return Promise.resolve();
    } catch (error) {
      console.error('Error getting current user:', error);
      logout(); // If we can't get user data, log out
      return Promise.reject(error);
    }
  };

  const value: AuthContextType = {
    user,
    token: authService.getToken(),
    isAuthenticated: authService.isAuthenticated() && !authService.isTokenExpired(),
    isLoading,
    login,
    register,
    logout,
    getCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};