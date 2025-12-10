import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/auth';
import { auth } from '../services/firebase';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await AuthService.login(email, password);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userData = await AuthService.register(email, password, name);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (name: string, avatar?: string) => {
    if (!user) throw new Error('No user logged in');
    try {
      await AuthService.updateProfile(user.id, name, avatar);
      const updatedUser = await AuthService.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
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
