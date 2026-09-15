import { api, unwrap } from '@/shared/api/client';
import type { Reservation } from '@/shared/api/types';

export function createReservation(screeningId: string, seats: number[]): Promise<Reservation> {
  return unwrap(api.post('/reservations', { screeningId, seats }));
}

export function confirmPayment(reservationId: string): Promise<{ id: string; status: string }> {
  return unwrap(api.post('/payments/confirm', { reservationId }));
}
