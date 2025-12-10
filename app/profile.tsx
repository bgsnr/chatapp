import { ProfileScreen } from '@/screens/ProfileScreen';
import { useRouter } from 'expo-router';
import React from 'react';

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  return <ProfileScreen onLogout={handleLogout} />;
}
