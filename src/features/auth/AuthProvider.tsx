import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { login as loginRequest, logout as logoutRequest, refresh, register as registerRequest } from '@/features/auth/api';
import { AuthContext } from '@/features/auth/useAuth';
import type { LoginValues, RegisterValues } from '@/features/auth/schemas';
import { setAccessToken } from '@/shared/api/session';
import type { Actor } from '@/shared/api/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Actor | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const session = await refresh();
        if (!session?.accessToken || !session.user) throw new Error('session');
        setAccessToken(session.accessToken);
        setUser(session.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const login = useCallback(async (values: LoginValues) => {
    const session = await loginRequest(values);
    setAccessToken(session.accessToken);
    setUser(session.user);
  }, []);

  const register = useCallback(async (values: RegisterValues) => {
    const session = await registerRequest(values);
    setAccessToken(session.accessToken);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, ready, login, register, logout }), [user, ready, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
