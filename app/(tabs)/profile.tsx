import { ProfileScreen } from '@/screens/ProfileScreen';
import { useRouter } from 'expo-router';
import React from 'react';

export default function ProfileTab() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  return <ProfileScreen onLogout={handleLogout} />;
}
