import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase';
import { logUserActivity, upsertUserProfile } from '../services/activityLogger';
import type { UserProfile } from '../types';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

type AuthProviderKind = 'firebase' | 'local' | 'demo' | null;

interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  authProvider: AuthProviderKind;
}

interface LocalAccount {
  uid: string;
  name: string;
  username: string;
  email: string | null;
  password: string;
}

interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (identifier: string, password: string) => Promise<void>;
  signUpWithPassword: (payload: { name: string; identifier: string; password: string }) => Promise<void>;
  signInDemo: () => void;
  signOut: () => Promise<void>;
  setProfile: (p: UserProfile) => void;
}

const PROFILE_KEY = 'devtool_user_profile';
const LOCAL_USERS_KEY = 'devtool_local_users';
const LOCAL_SESSION_KEY = 'devtool_local_session';

const AuthContext = createContext<AuthContextValue | null>(null);

function logDbError(scope: string, err: unknown) {
  console.error(`[firebase][${scope}]`, err);
}

function loadLocalUsers(): LocalAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as LocalAccount[]) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: LocalAccount[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function readLocalSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeLocalSession(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    return;
  }
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
}

function sanitizeIdentifier(identifier: string): string {
  return identifier.trim().toLowerCase();
}

function buildLocalUser(account: LocalAccount): AuthUser {
  return {
    uid: account.uid,
    email: account.email,
    displayName: account.name,
    photoURL: null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readLocalSession());
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const s = localStorage.getItem(PROFILE_KEY);
    return s ? (JSON.parse(s) as UserProfile) : null;
  });
  const [loading, setLoading] = useState(true);
  const [authProvider, setAuthProvider] = useState<AuthProviderKind>(() => (readLocalSession() ? 'local' : null));

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
        setAuthProvider('firebase');
        writeLocalSession(null);
        void upsertUserProfile(db, nextUser.uid, nextUser, profile).catch((e) => logDbError('upsertUserProfile:onAuthStateChanged', e));
        void logUserActivity(db, nextUser.uid, { action: 'login_success', provider: 'google' }).catch((e) => logDbError('logUserActivity:login_success', e));
      } else if (authProvider === 'firebase' || authProvider === null) {
        setUser(null);
        setAuthProvider(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [authProvider, profile]);

  useEffect(() => {
    if (authProvider === 'local') {
      setLoading(false);
    }
  }, [authProvider]);

  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    if (user && authProvider === 'firebase') {
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
      throw new Error('Firebase not configured. Add VITE_FIREBASE_* env vars or use username/password login.');
    }
    await signInWithPopup(auth, googleProvider);
  };

  const signUpWithPassword = async ({ name, identifier, password }: { name: string; identifier: string; password: string }) => {
    const safeName = name.trim();
    const safeIdentifier = sanitizeIdentifier(identifier);
    const safePassword = password.trim();

    if (!safeName) throw new Error('Name is required.');
    if (!safeIdentifier) throw new Error('Username or email is required.');
    if (safePassword.length < 6) throw new Error('Password must be at least 6 characters.');

    const users = loadLocalUsers();
    const isEmail = safeIdentifier.includes('@');
    const duplicate = users.some((acc) =>
      isEmail
        ? (acc.email ?? '').toLowerCase() === safeIdentifier
        : acc.username.toLowerCase() === safeIdentifier
    );

    if (duplicate) {
      throw new Error(isEmail ? 'Email already exists.' : 'Username already exists.');
    }

    const account: LocalAccount = {
      uid: `local-${crypto.randomUUID()}`,
      name: safeName,
      username: isEmail ? safeIdentifier.split('@')[0] : safeIdentifier,
      email: isEmail ? safeIdentifier : null,
      password: safePassword,
    };

    saveLocalUsers([account, ...users]);
    const localUser = buildLocalUser(account);
    setUser(localUser);
    setAuthProvider('local');
    writeLocalSession(localUser);
  };

  const signInWithPassword = async (identifier: string, password: string) => {
    const safeIdentifier = sanitizeIdentifier(identifier);
    const safePassword = password.trim();

    if (!safeIdentifier || !safePassword) {
      throw new Error('Enter username/email and password.');
    }

    const users = loadLocalUsers();
    const account = users.find((acc) => {
      const byUsername = acc.username.toLowerCase() === safeIdentifier;
      const byEmail = (acc.email ?? '').toLowerCase() === safeIdentifier;
      return (byUsername || byEmail) && acc.password === safePassword;
    });

    if (!account) {
      throw new Error('Invalid username/email or password.');
    }

    const localUser = buildLocalUser(account);
    setUser(localUser);
    setAuthProvider('local');
    writeLocalSession(localUser);
  };

  const signInDemo = () => {
    const demoUser = {
      uid: 'demo-user',
      email: 'demo@devtool.local',
      displayName: 'Guest',
      photoURL: null,
    };
    setUser(demoUser);
    setProfileState({ department: 'general', roleId: 'general' });
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ department: 'general', roleId: 'general' }));
    setAuthProvider('demo');
    writeLocalSession(null);
  };

  const signOut = async () => {
    if (authProvider === 'demo' || authProvider === 'local') {
      setUser(null);
      setProfileState(null);
      setAuthProvider(null);
      localStorage.removeItem(PROFILE_KEY);
      writeLocalSession(null);
      return;
    }

    if (auth) await firebaseSignOut(auth);
    if (user && authProvider === 'firebase') {
      void logUserActivity(db, user.uid, { action: 'logout' }).catch((e) => logDbError('logUserActivity:logout', e));
    }
    setUser(null);
    setProfileState(null);
    setAuthProvider(null);
    localStorage.removeItem(PROFILE_KEY);
    writeLocalSession(null);
  };

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    isDemo: authProvider === 'demo',
    authProvider,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
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
