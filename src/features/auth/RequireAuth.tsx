import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/features/auth/useAuth';
import type { ReactNode } from 'react';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <p style={{ padding: '32px', color: '#fff' }}>Chargement de la session…</p>;
  }

  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return children;
}
