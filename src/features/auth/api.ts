import { api, unwrap } from '@/shared/api/client';
import type { AuthSession } from '@/shared/api/types';
import type { LoginValues, RegisterValues } from '@/features/auth/schemas';

export function login(values: LoginValues): Promise<AuthSession> {
  return unwrap(api.post('/auth/login', values));
}

export function register(values: RegisterValues): Promise<AuthSession> {
  return unwrap(api.post('/auth/register', values));
}

export function refresh(): Promise<AuthSession> {
  return unwrap(api.post('/auth/refresh', undefined, { timeout: 8000 }));
}

export function logout(): Promise<void> {
  return api.post('/auth/logout').then(() => undefined);
}
