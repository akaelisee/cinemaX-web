import { api, unwrap, unwrapList } from '@/shared/api/client';
import type { Screening } from '@/shared/api/types';

export function fetchScreenings(params: { roomId?: string; movieId?: string; from?: string }): Promise<{
  data: Screening[];
  meta: { page: number; perPage: number; total: number };
}> {
  return unwrapList(api.get('/screenings', { params: { perPage: 100, ...params } }));
}

export function fetchScreening(id: string): Promise<Screening> {
  return unwrap(api.get(`/screenings/${id}`));
}
