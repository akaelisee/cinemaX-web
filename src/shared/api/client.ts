import axios, { isAxiosError, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken } from '@/shared/api/session';
import type { ApiErrorBody, ApiSuccess } from '@/shared/api/types';

const apiOrigin = import.meta.env.DEV
  ? ''
  : String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export const api = axios.create({
  baseURL: `${apiOrigin}/api/v1`,
  withCredentials: true,
  timeout: 12_000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = api
    .post<ApiSuccess<{ accessToken: string }>>('/auth/refresh')
    .then((response) => {
      setAccessToken(response.data.data.accessToken);
      return true;
    })
    .catch(() => {
      setAccessToken(null);
      return false;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const url = original?.url ?? '';
    const skipped = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');
    if (error.response?.status === 401 && original && !skipped && !original._retry) {
      const ok = await tryRefresh();
      if (ok) {
        original._retry = true;
        return api.request(original);
      }
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        const redirect = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
        window.location.assign(`/login?redirect=${redirect}`);
      }
    }
    throw error;
  },
);

export function apiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.error?.message) return body.error.message;
    if (error.code === 'ECONNABORTED') {
      return 'Le serveur met trop longtemps à répondre. Réessaie dans un instant.';
    }
    if (!error.response) {
      return 'Impossible de joindre le serveur. En local, lance l’API (port 3000). Si tu appelles Render directement, ajoute http://localhost:5174 à CORS_ORIGINS.';
    }
  }
  if (error instanceof Error) return error.message;
  return 'Une erreur est survenue.';
}

export function conflictSeats(error: unknown): number[] {
  if (!isAxiosError(error)) return [];
  const body = error.response?.data as ApiErrorBody | undefined;
  if (body?.error?.code !== 'SEAT_ALREADY_TAKEN') return [];
  return (body.error.details ?? [])
    .map((detail) => detail.seat)
    .filter((seat): seat is number => typeof seat === 'number');
}

export async function unwrap<T>(promise: Promise<{ data: ApiSuccess<T> }>): Promise<T> {
  const response = await promise;
  return response.data.data;
}

export async function unwrapList<T>(
  promise: Promise<{ data: ApiSuccess<T[]> & { meta: { page: number; perPage: number; total: number } } }>,
): Promise<{ data: T[]; meta: { page: number; perPage: number; total: number } }> {
  const response = await promise;
  const payload = response.data;
  return {
    data: payload.data,
    meta: payload.meta ?? { page: 1, perPage: payload.data.length, total: payload.data.length },
  };
}
