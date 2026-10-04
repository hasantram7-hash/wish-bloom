import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const GUEST_ID_KEY = 'wishverse_guest_id';
const MY_SURPRISES_KEY = 'wishverse_my_surprises';

function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return 'guest_default';
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  guestId: string;
  isGuest: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  saveCreatedSurprise: (slug: string) => void;
  isMySurprise: (slug: string, ownerId?: string) => boolean;
  getMySurprises: () => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string>('guest_default');

  useEffect(() => {
    setGuestId(getOrCreateGuestId());

    // Process redirect result if returning from redirect flow
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((err) => {
        console.warn('Redirect sign-in check:', err);
      });

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setAuthError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveCreatedSurprise = (slug: string) => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(MY_SURPRISES_KEY);
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(slug)) {
        list.push(slug);
        localStorage.setItem(MY_SURPRISES_KEY, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Error saving surprise to localStorage:', e);
    }
  };

  const getMySurprises = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(MY_SURPRISES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const isMySurprise = (slug: string, ownerId?: string): boolean => {
    if (user && ownerId && user.uid === ownerId) return true;
    if (ownerId && ownerId === guestId) return true;
    const list = getMySurprises();
    return list.includes(slug);
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.error('Google Sign-In error:', err);

      if (err.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        setAuthError(
          `Unauthorized Domain: "${domain}" must be added in Firebase Console → Authentication → Settings → Authorized domains.`
        );
        return null;
      }

      if (err.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return null;
        } catch {
          setAuthError('Sign-in popup was blocked. Please allow popups or use another browser.');
          return null;
        }
      }

      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in was closed before completion. Please try again.');
        return null;
      }

      setAuthError(err.message || 'Failed to sign in with Google. Check Firebase credentials.');
      return null;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: unknown) {
      console.error('Sign-out error:', error);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        guestId,
        isGuest: !user,
        signInWithGoogle,
        signOutUser,
        authError,
        clearAuthError,
        saveCreatedSurprise,
        isMySurprise,
        getMySurprises,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
