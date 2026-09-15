import type { Screening } from '@/shared/api/types';

export type ProgrammeView = {
  id: string;
  movie: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  duree: string;
  salle: string;
  date: string;
  heure: string;
  genre: string;
  price: number;
  vip: number;
  nombre: number;
  vipSeats: number[];
  takenSeats: number[];
};

export function formatDuree(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${String(rest)}m`;
  return `${String(hours)}h ${String(rest)}m`;
}

export function formatProgrammeDate(iso: string): string {
  const date = iso.slice(0, 10);
  return date.slice(8, 10) + date.slice(4, 8) + date.slice(0, 4);
}

export function screeningToProgramme(screening: Screening): ProgrammeView {
  const movie = screening.movie;
  const room = screening.room;
  const starts = new Date(screening.startsAt);
  return {
    id: screening.id,
    movie: movie?.title ?? '',
    overview: movie?.overview ?? '',
    poster_path: movie?.posterUrl ?? '',
    backdrop_path: movie?.backdropUrl ?? movie?.posterUrl ?? '',
    duree: formatDuree(movie?.duration ?? 0),
    salle: room?.name ?? '',
    date: screening.startsAt,
    heure: starts.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    genre: movie?.genre?.label ?? '',
    price: screening.price,
    vip: screening.vipPrice,
    nombre: room?.capacity ?? 0,
    vipSeats: room?.vipSeats ?? [],
    takenSeats: screening.takenSeats ?? [],
  };
}

export function uniqueMovieScreenings(screenings: Screening[] | undefined): Screening[] {
  const byMovie = new Map<string, Screening>();
  const sorted = [...(screenings ?? [])].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  for (const screening of sorted) {
    if (!byMovie.has(screening.movieId)) byMovie.set(screening.movieId, screening);
  }
  return [...byMovie.values()];
}

export function checkoutLoginPath(screeningId: string): string {
  return `/login?redirect=/programme/${screeningId}`;
}

export function computeTotal(seats: number[], vipSeats: number[], price: number, vipPrice: number): number {
  return seats.reduce((sum, seat) => sum + (vipSeats.includes(seat) ? vipPrice : price), 0);
}

export type SeatStatus = 'free' | 'vip' | 'selected' | 'taken' | 'conflict';

export function seatStatus(params: {
  seat: number;
  vipSeats: number[];
  takenSeats: number[];
  selected: number[];
  conflictSeats: number[];
}): SeatStatus {
  if (params.conflictSeats.includes(params.seat)) return 'conflict';
  if (params.takenSeats.includes(params.seat)) return 'taken';
  if (params.selected.includes(params.seat)) return 'selected';
  if (params.vipSeats.includes(params.seat)) return 'vip';
  return 'free';
}

export function conflictMessage(seats: number[]): string {
  if (!seats.length) return '';
  return `Place(s) déjà prise(s) : ${seats.join(', ')}`;
}
