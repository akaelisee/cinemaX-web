import { useQuery } from '@tanstack/react-query';
import Container from '@/styles/Container.js';
import Wrapper from '@/styles/Wrapper.js';
import { RoomCarousel } from '@/features/rooms/RoomCarousel';
import { fetchScreenings } from '@/features/screenings/api';

export function RoomsPage() {
  const query = useQuery({
    queryKey: ['screenings', 'tarifs'],
    queryFn: () => fetchScreenings({ from: new Date().toISOString() }),
  });

  const screenings = query.data?.data ?? [];
  const stdPrices = screenings.map((item) => item.price);
  const vipPrices = screenings.map((item) => item.vipPrice);
  const minStd = stdPrices.length ? Math.min(...stdPrices) : null;
  const maxVip = vipPrices.length ? Math.max(...vipPrices) : null;

  return (
    <Container>
      <RoomCarousel />
      <Wrapper>
        <div className="wrapper__title">
          <p>
            <span> Horaire Chez</span> Future Cinema
          </p>
        </div>
        <div className="wrapper__grid">
          <div className="wrapper__tarif">
            <div className="grid__price">
              <p className="red"> Tarifs Standard </p>
              <p className="results"> {minStd === null ? '-' : `${String(minStd)} €`} </p>
            </div>
            <div className="grid__vip">
              <p className="red"> Tarifs Vip </p>
              <p className="results"> {maxVip === null ? '-' : `${String(maxVip)} €`} </p>
            </div>
          </div>

          <div className="wrapper__horaire">
            <p className="title red"> Horaire d&lsquo;ouverture </p>

            <div className="grid__horaire">
              <div className="horaire__item">
                <span className="red"> Lundi </span>
                <span className="results"> 13H à 23H </span>
              </div>
              <div className="horaire__item">
                <span className="red"> Mardi </span>
                <span className="results"> 13H à 23H </span>
              </div>
              <div className="horaire__item">
                <span className="red"> Mercredi </span>
                <span className="results"> 09H à 23H </span>
              </div>
              <div className="horaire__item">
                <span className="red"> Jeudi </span>
                <span className="results"> 13H à 23H </span>
              </div>
              <div className="horaire__item">
                <span className="red"> Vendredi </span>
                <span className="results"> 13H à 23H </span>
              </div>
              <div className="horaire__item">
                <span className="red"> Samedi </span>
                <span className="results"> 09H à 01H </span>
              </div>
              <div className="horaire__item">
                <span className="red"> Dimanche </span>
                <span className="results"> 09H à 23H </span>
              </div>
            </div>
          </div>
          <div className="wrapper__tel">
            <p className="red"> Téléphone :</p>
            <span className="results"> +33 (0)6 65 12 45 78</span>
          </div>
          <div className="wrapper__adresse">
            <p className="red">Adresse :</p>
            <span className="results">
              41 Avenue du general de Gaulle, 94170 le Perreux sur Marne
            </span>
          </div>
        </div>
      </Wrapper>
    </Container>
  );
}
