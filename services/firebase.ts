import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - Replace with your Firebase config
const firebaseConfig = {

  apiKey: "AIzaSyA7A3odC2of4xbiiarYPutJJoPmcj43Gps",

  authDomain: "chatapp-4b8d9.firebaseapp.com",

  projectId: "chatapp-4b8d9",

  storageBucket: "chatapp-4b8d9.firebasestorage.app",

  messagingSenderId: "576614995834",

  appId: "1:576614995834:web:ab1be6abc1bfa3f5f5e8c3",

  measurementId: "G-VXXTS0NFFB"

};


// For better security, use environment variables in production
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || firebaseConfig.appId,
};

const app = initializeApp(config);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);

export default app;
