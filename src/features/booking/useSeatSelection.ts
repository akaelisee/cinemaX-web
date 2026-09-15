import { useCallback, useState } from 'react';

const storageKey = (screeningId: string) => `cinemax:seats:${screeningId}`;

export function useSeatSelection(screeningId: string, takenSeats: number[]) {
  const [selected, setSelected] = useState<number[]>(() => {
    try {
      const raw = sessionStorage.getItem(storageKey(screeningId));
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((seat): seat is number => typeof seat === 'number' && !takenSeats.includes(seat));
    } catch {
      return [];
    }
  });

  const persist = useCallback(
    (next: number[]) => {
      sessionStorage.setItem(storageKey(screeningId), JSON.stringify(next));
      setSelected(next);
    },
    [screeningId],
  );

  const toggle = useCallback(
    (seat: number) => {
      if (takenSeats.includes(seat)) return;
      persist(selected.includes(seat) ? selected.filter((item) => item !== seat) : [...selected, seat].sort((a, b) => a - b));
    },
    [persist, selected, takenSeats],
  );

  const removeSeats = useCallback(
    (seats: number[]) => {
      persist(selected.filter((seat) => !seats.includes(seat)));
    },
    [persist, selected],
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  return { selected, toggle, removeSeats, clear };
}
