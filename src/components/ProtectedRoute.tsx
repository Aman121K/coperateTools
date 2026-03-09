import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg-primary)]">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">Loading workspace...</p>
      </div>
    );
  }

  // Allow anonymous users to access tools and shared links.
  if (!user) return <>{children}</>;

  if (!profile) {
    return <Navigate to="/select-role" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
