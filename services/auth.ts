import {
    createUserWithEmailAndPassword,
    updateProfile as firebaseUpdateProfile,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { User } from '../types';
import { auth, db } from './firebase';

export class AuthService {
  // Register user with email and password
  static async register(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase profile
      await firebaseUpdateProfile(firebaseUser, {
        displayName: name,
      });

      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        name: name,
        createdAt: new Date(),
        status: 'online',
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: Timestamp.fromDate(userData.createdAt),
        lastSeen: Timestamp.fromDate(new Date()),
      });

      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  // Login user
  static async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        
        // Update last seen
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          lastSeen: Timestamp.fromDate(new Date()),
          status: 'online',
        });

        return {
          ...userData,
          createdAt: userData.createdAt instanceof Timestamp 
            ? userData.createdAt.toDate() 
            : new Date(userData.createdAt),
        };
      }

      throw new Error('User data not found');
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        return {
          ...userData,
          createdAt: userData.createdAt instanceof Timestamp 
            ? userData.createdAt.toDate() 
            : new Date(userData.createdAt),
        };
      }

      return null;
    } catch {
      return null;
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        // Update user status to offline
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          status: 'offline',
          lastSeen: Timestamp.fromDate(new Date()),
        });
      }

      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  // Update user profile
  static async updateProfile(userId: string, name: string, avatar?: string): Promise<void> {
    try {
      const firebaseUser = auth.currentUser;
      
      if (firebaseUser) {
        await firebaseUpdateProfile(firebaseUser, {
          displayName: name,
          photoURL: avatar,
        });
      }

      const updateData: any = { name };
      if (avatar) {
        updateData.avatar = avatar;
      }

      await updateDoc(doc(db, 'users', userId), updateData);
    } catch (error: any) {
      throw new Error(error.message || 'Update profile failed');
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        return {
          ...userData,
          createdAt: userData.createdAt instanceof Timestamp 
            ? userData.createdAt.toDate() 
            : new Date(userData.createdAt),
        };
      }

      return null;
    } catch {
      return null;
    }
  }
}
