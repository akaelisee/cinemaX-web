import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Wrapper from '@/styles/Wrapper.js';
import styled from 'styled-components';
import Rows from '@/styles/Rows.js';
import { Banner } from '@/features/booking/components/Banner';
import { DetailProgramme } from '@/features/booking/components/DetailProgramme';
import { BookingSummary } from '@/features/booking/components/BookingSummary';
import { SeatLegend } from '@/features/booking/components/SeatLegend';
import { SeatMap } from '@/features/booking/components/SeatMap';
import { CheckoutDialog } from '@/features/booking/components/CheckoutDialog';
import Loader from '@/shared/ui/Loader';
import { fetchScreening } from '@/features/screenings/api';
import { screeningToProgramme, checkoutLoginPath } from '@/features/booking/types';
import { useSeatSelection } from '@/features/booking/useSeatSelection';
import { useAuth } from '@/features/auth/useAuth';

const checkoutFlag = (screeningId: string) => `cinemax:openCheckout:${screeningId}`;

export function ScreeningPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const id = params.id ?? '';
  const [isExistCart, setIsExistCart] = useState(false);
  const [conflictSeats, setConflictSeats] = useState<number[]>([]);

  const query = useQuery({
    queryKey: ['screening', id],
    queryFn: () => fetchScreening(id),
    enabled: Boolean(id),
  });

  const taken = [...(query.data?.takenSeats ?? []), ...conflictSeats];
  const seats = useSeatSelection(id, taken);

  useEffect(() => {
    if (!ready || !user || !id) return;
    if (sessionStorage.getItem(checkoutFlag(id)) !== '1') return;
    if (seats.selected.length === 0) return;
    sessionStorage.removeItem(checkoutFlag(id));
    setIsExistCart(true);
  }, [ready, user, id, seats.selected.length]);

  if (query.isPending) {
    return <Loader />;
  }

  if (!query.data) {
    return <Loader />;
  }

  const programme = screeningToProgramme(query.data);
  const programmes = [programme];

  const onPay = () => {
    if (!ready) return;
    if (!user) {
      sessionStorage.setItem(checkoutFlag(id), '1');
      void navigate(checkoutLoginPath(id));
      return;
    }
    setIsExistCart(true);
  };

  return (
    <ContainerPro>
      <div className="detail__programme">
        <Banner programmes={programmes} />
      </div>
      <div className="detail__pro">
        <DetailProgramme programmes={programmes} />
      </div>
      <Wrapper>
        <Rows>
          <div className="rows__payment">
            <BookingSummary
              selected={seats.selected}
              vipSeats={programme.vipSeats}
              price={programme.price}
              vipPrice={programme.vip}
              onPay={onPay}
            />
          </div>
          <div className="rows__place">
            <div className="mult__option">
              <SeatLegend />
            </div>
            <div className="block"></div>
            <div>
              <div className="nbre__Place">
                <SeatMap
                  capacity={programme.nombre}
                  vipSeats={programme.vipSeats}
                  takenSeats={taken}
                  selected={seats.selected}
                  conflictSeats={conflictSeats}
                  onToggle={seats.toggle}
                />
              </div>
            </div>
          </div>
        </Rows>
        {isExistCart && user ? (
          <div className="" style={{ paddingTop: '70px' }}>
            <CheckoutDialog
              screeningId={id}
              selected={seats.selected}
              onClose={() => {
                setIsExistCart(false);
              }}
              onConflict={(next) => {
                setConflictSeats((current) => [...current, ...next]);
                seats.removeSeats(next);
              }}
              onSuccess={() => {
                setConflictSeats((current) => [...current, ...seats.selected]);
                seats.clear();
                setIsExistCart(false);
                void query.refetch();
              }}
            />
          </div>
        ) : null}
      </Wrapper>
    </ContainerPro>
  );
}

const ContainerPro = styled.div`
  color: #fff;
  .col__pro {
    position: relative;
    .pro__backdrop {
      position: absolute;
      top: 0;
      width: 100%;
      bottom: 0;
      background-color: rgba(0, 33, 53, 0.759);
    }
  }
  .detail__pro {
    background-color: #004560;
  }
`;
