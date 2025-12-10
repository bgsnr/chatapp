import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';

export const AuthEntryScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { loading } = useAuth();

  return isLogin ? (
    <LoginScreen onNavigateToRegister={() => setIsLogin(false)} />
  ) : (
    <RegisterScreen onNavigateToLogin={() => setIsLogin(true)} />
  );
};
