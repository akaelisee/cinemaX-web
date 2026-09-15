import axios, { isAxiosError, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken } from '@/shared/api/session';
import type { ApiErrorBody, ApiSuccess } from '@/shared/api/types';

// Same-origin : Vite (dev/preview) et Netlify proxyent /api vers l’API.
// VITE_API_URL n’est pas lu ici — il sert uniquement de cible au proxy.
export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  timeout: 60_000,
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
      const token = response.data?.data?.accessToken;
      if (!token) return false;
      setAccessToken(token);
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
      return 'Impossible de joindre le serveur. En local, lance l’API (cinemaX, port 3000) ou pointe VITE_API_URL vers Render, puis relance Vite.';
    }
    if (typeof error.response.data === 'string' && error.response.data.includes('<')) {
      return 'Le site a reçu une page HTML à la place de l’API. Redéploie Netlify pour activer le proxy /api.';
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asApiPayload(response: { data: unknown }): unknown {
  const payload = response.data;
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (trimmed.startsWith('<') || trimmed.startsWith('<!')) {
      throw invalidApiBody();
    }
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      throw invalidApiBody();
    }
  }
  return payload;
}

function invalidApiBody(): Error {
  return new Error(
    'Le front n’a pas reçu le JSON de l’API (souvent la page du site à la place). Relance Vite, et sur Netlify redéploie pour le proxy /api.',
  );
}

export async function unwrap<T>(promise: Promise<{ data: ApiSuccess<T> }>): Promise<T> {
  const response = await promise;
  const payload = asApiPayload(response);
  if (!isRecord(payload) || !('data' in payload) || payload.data === undefined) {
    throw invalidApiBody();
  }
  return payload.data as T;
}

export async function unwrapList<T>(
  promise: Promise<{ data: ApiSuccess<T[]> & { meta: { page: number; perPage: number; total: number } } }>,
): Promise<{ data: T[]; meta: { page: number; perPage: number; total: number } }> {
  const response = await promise;
  const payload = asApiPayload(response);
  const rows = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.data)
      ? payload.data
      : null;
  if (!rows) throw invalidApiBody();
  const meta =
    isRecord(payload) && isRecord(payload.meta)
      ? {
          page: Number(payload.meta.page) || 1,
          perPage: Number(payload.meta.perPage) || rows.length,
          total: Number(payload.meta.total) || rows.length,
        }
      : { page: 1, perPage: rows.length, total: rows.length };
  return { data: rows as T[], meta };
}
