import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isGuest?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseAvailable: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (name?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'paper_genius_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const isFirebaseAvailable = !!auth;

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const profile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Educator',
            photoURL: firebaseUser.photoURL,
            isGuest: false,
          };
          setUser(profile);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        } else {
          // If we had a guest user, keep it; otherwise clear
          const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.isGuest) {
              setUser(parsed);
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    if (auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      // Offline/Local authentication fallback
      const guestUser: UserProfile = {
        uid: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: email.split('@')[0],
        isGuest: false,
      };
      setUser(guestUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guestUser));
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    if (auth) {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user && name) {
        await updateProfile(res.user, { displayName: name });
      }
    } else {
      const newUser: UserProfile = {
        uid: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: name || email.split('@')[0],
        isGuest: false,
      };
      setUser(newUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    }
  };

  const loginWithGoogle = async () => {
    if (auth) {
      await signInWithPopup(auth, googleProvider);
    } else {
      const mockGoogleUser: UserProfile = {
        uid: 'google-' + Math.random().toString(36).substring(2, 9),
        email: 'educator.google@papergenius.ai',
        displayName: 'Google Educator',
        isGuest: false,
      };
      setUser(mockGoogleUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockGoogleUser));
    }
  };

  const loginAsGuest = (name: string = 'Guest Teacher') => {
    const guest: UserProfile = {
      uid: 'guest-' + Date.now(),
      email: 'guest@papergenius.ai',
      displayName: name,
      isGuest: true,
    };
    setUser(guest);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guest));
  };

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error('Sign out error', e);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseAvailable,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
