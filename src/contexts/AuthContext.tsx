import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db, googleProvider, facebookProvider, githubProvider, isFirebaseConfigured } from '../config/firebase';
import { logUserActivity, upsertUserProfile } from '../services/activityLogger';
import type { UserProfile } from '../types';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
}

interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInDemo: () => void;
  signOut: () => Promise<void>;
  setProfile: (p: UserProfile) => void;
}

const PROFILE_KEY = 'devtool_user_profile';

const AuthContext = createContext<AuthContextValue | null>(null);

function logDbError(scope: string, err: unknown) {
  console.error(`[firebase][${scope}]`, err);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const s = localStorage.getItem(PROFILE_KEY);
    return s ? (JSON.parse(s) as UserProfile) : null;
  });
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const nextUser = {
          uid: fbUser.uid,
          email: fbUser.email ?? null,
          displayName: fbUser.displayName ?? null,
          photoURL: fbUser.photoURL ?? null,
        };
        setUser(nextUser);
        void upsertUserProfile(db, nextUser.uid, nextUser, profile).catch((e) => logDbError('upsertUserProfile:onAuthStateChanged', e));
        void logUserActivity(db, nextUser.uid, { action: 'login_success', provider: 'oauth' }).catch((e) => logDbError('logUserActivity:login_success', e));
        setIsDemo(false);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    if (user) {
      void upsertUserProfile(db, user.uid, user, p).catch((e) => logDbError('upsertUserProfile:setProfile', e));
      void logUserActivity(db, user.uid, {
        action: 'profile_updated',
        department: p.department,
        roleId: p.roleId,
      }).catch((e) => logDbError('logUserActivity:profile_updated', e));
    }
  };

  const signInWithGoogle = async () => {
    if (!auth || !isFirebaseConfigured) {
      throw new Error('Firebase not configured. Add VITE_FIREBASE_* env vars or use Demo Login.');
    }
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithFacebook = async () => {
    if (!auth || !isFirebaseConfigured) {
      throw new Error('Firebase not configured. Add VITE_FIREBASE_* env vars or use Demo Login.');
    }
    await signInWithPopup(auth, facebookProvider);
  };

  const signInWithGitHub = async () => {
    if (!auth || !isFirebaseConfigured) {
      throw new Error('Firebase not configured. Add VITE_FIREBASE_* env vars or use Demo Login.');
    }
    await signInWithPopup(auth, githubProvider);
  };

  const signInDemo = () => {
    setUser({
      uid: 'demo-user',
      email: 'demo@devtool.local',
      displayName: 'Guest',
      photoURL: null,
    });
    setProfileState({ department: 'general', roleId: 'general' });
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ department: 'general', roleId: 'general' }));
    setIsDemo(true);
  };

  const signOut = async () => {
    if (isDemo) {
      setUser(null);
      setProfileState(null);
      localStorage.removeItem(PROFILE_KEY);
      return;
    }
    if (auth) await firebaseSignOut(auth);
    if (user) {
      void logUserActivity(db, user.uid, { action: 'logout' }).catch((e) => logDbError('logUserActivity:logout', e));
    }
    setUser(null);
    setProfileState(null);
    localStorage.removeItem(PROFILE_KEY);
  };

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    isDemo,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGitHub,
    signInDemo,
    signOut,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
