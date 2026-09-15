import { useQuery } from '@tanstack/react-query';
import { Loader } from '@/shared/ui/Loader';
import { fetchRooms } from '@/features/rooms/api';
import { RoomSlide } from '@/features/rooms/RoomSlide';

export function RoomCarousel() {
  const query = useQuery({
    queryKey: ['rooms'],
    queryFn: () => fetchRooms(),
  });

  if (query.isPending) {
    return <Loader overlay={false} />;
  }

  return (
    <div className="rows__swiper">
      <RoomSlide rooms={query.data?.data ?? []} />
    </div>
  );
}
