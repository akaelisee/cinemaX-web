export type ApiSuccess<T> = { data: T; meta?: { page: number; perPage: number; total: number } };

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: Array<{ path?: string; message: string; seat?: number }>;
  };
};

export type Actor = {
  id: string;
  role: 'ADMIN' | 'STAFF' | 'CLIENT';
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export type AuthSession = {
  user: Actor;
  accessToken: string;
  expiresIn: number;
};

export type Genre = { id: number; label: string };

export type Movie = {
  id: string;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string | null;
  duration: number;
  releaseDate: string;
  genreId: number;
  genre?: Genre;
};

export type Room = {
  id: string;
  name: string;
  capacity: number;
  vipSeats: number[];
};

export type Screening = {
  id: string;
  movieId: string;
  roomId: string;
  startsAt: string;
  price: number;
  vipPrice: number;
  movie?: Movie;
  room?: Room;
  takenSeats: number[];
};

export type Reservation = {
  id: string;
  screeningId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalAmount: number;
  clientSecret?: string;
  seats: Array<{ seatNumber: number; isVip: boolean }>;
};
