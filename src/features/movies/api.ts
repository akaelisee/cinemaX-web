import { api, unwrap, unwrapList } from '@/shared/api/client';
import type { Movie } from '@/shared/api/types';

export function fetchMovies(page = 1, perPage = 24): Promise<{ data: Movie[]; meta: { page: number; perPage: number; total: number } }> {
  return unwrapList(api.get('/movies', { params: { page, perPage } }));
}

export function fetchMovie(id: string): Promise<Movie> {
  return unwrap(api.get(`/movies/${id}`));
}
