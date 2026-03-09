import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isFirebaseConfigured } from '../config/firebase';

type AuthMode = 'login' | 'signup';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && profile) navigate('/choose-tools', { replace: true });
    else if (user) navigate('/select-role', { replace: true });
  }, [user, profile, navigate]);

  const { signInWithGoogle, signInWithPassword, signUpWithPassword, signInDemo } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLocalLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPassword(identifier, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      await signUpWithPassword({ name, identifier, password });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-stretch overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[var(--shadow-elevated)] lg:grid-cols-[1.15fr_0.85fr] animate-fade-up">
        <section className="hidden lg:flex flex-col justify-between p-10 border-r border-[var(--border)] bg-[linear-gradient(165deg,#1a3855_0%,#101b2a_55%,#172538_100%)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)]/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              DevTool Platform
            </div>
            <h1 className="mt-6 text-4xl leading-tight font-semibold text-[var(--text-primary)]">
              Internal tools with a cleaner workflow for every team.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[var(--text-secondary)]">
              One secure workspace for converters, calculators, media utilities, and daily operations tasks.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/70 p-4">
              <p className="text-2xl font-semibold text-[var(--text-primary)]">80+</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Ready-to-use tools</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/70 p-4">
              <p className="text-2xl font-semibold text-[var(--text-primary)]">10+</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Departments covered</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/70 p-4">
              <p className="text-2xl font-semibold text-[var(--text-primary)]">24/7</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Browser access</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8 shadow-[var(--shadow-card)]">
            <div className="flex flex-col items-center mb-6">
              <div className="h-16 w-16 rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)] flex items-center justify-center shadow-[var(--shadow-card)]">
                <img src="/logo.png" alt="Corporate Tools" className="h-11 w-11 object-contain" />
              </div>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--text-primary)] text-center">
                {mode === 'login' ? 'Sign in to DevTool' : 'Create your account'}
              </h2>
              <p className="text-sm text-[var(--text-muted)] text-center mt-2">
                {mode === 'login' ? 'Use Google SSO or your username/email and password.' : 'Register with your name, username/email, and a secure password.'}
              </p>
            </div>

            <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] p-1 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'login'
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'signup'
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Register
              </button>
            </div>

            <div className="space-y-3">
              {isFirebaseConfigured && (
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-medium transition-colors disabled:opacity-60"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              )}

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[var(--bg-secondary)] text-[var(--text-muted)]">or use credentials</span>
                </div>
              </div>

              {mode === 'signup' && (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]/50"
                />
              )}

              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Username or email"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]/50"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]/50"
              />

              <button
                type="button"
                onClick={mode === 'login' ? handleLocalLogin : handleSignup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold transition-colors disabled:opacity-60"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>

              <button
                type="button"
                onClick={signInDemo}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold transition-colors"
              >
                Continue with Demo Workspace
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
            )}

            {!isFirebaseConfigured && (
              <p className="mt-4 text-xs text-[var(--text-muted)] text-center">
                Google login is unavailable until Firebase is configured in `.env`.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
