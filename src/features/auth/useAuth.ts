import { createContext, useContext } from 'react';
import type { Actor } from '@/shared/api/types';
import type { LoginValues, RegisterValues } from '@/features/auth/schemas';

export type AuthContextValue = {
  user: Actor | null;
  ready: boolean;
  login: (values: LoginValues) => Promise<void>;
  register: (values: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider.');
  return ctx;
}
