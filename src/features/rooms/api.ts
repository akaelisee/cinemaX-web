import { api, unwrap, unwrapList } from '@/shared/api/client';
import type { Room } from '@/shared/api/types';

export function fetchRooms(): Promise<{ data: Room[]; meta: { page: number; perPage: number; total: number } }> {
  return unwrapList(api.get('/rooms', { params: { perPage: 50 } }));
}

export function fetchRoom(id: string): Promise<Room> {
  return unwrap(api.get(`/rooms/${id}`));
}
