import { Seat } from '@/features/booking/components/Seat';
import { seatStatus } from '@/features/booking/types';

export function SeatMap({
  capacity,
  vipSeats,
  takenSeats,
  selected,
  conflictSeats,
  onToggle,
}: {
  capacity: number;
  vipSeats: number[];
  takenSeats: number[];
  selected: number[];
  conflictSeats: number[];
  onToggle: (seat: number) => void;
}) {
  const places = Array.from({ length: capacity }, (_, index) => index + 1);

  return (
    <>
      {places.map((seat) => {
        const status = seatStatus({ seat, vipSeats, takenSeats, selected, conflictSeats });
        return (
          <Seat
            key={seat}
            number={seat}
            status={status}
            onClick={() => {
              onToggle(seat);
            }}
          />
        );
      })}
    </>
  );
}
