import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Container from '@/styles/Container.js';
import Card from '@/styles/Card.js';
import Wrapper from '@/styles/Wrapper.js';
import { Loader } from '@/shared/ui/Loader';
import { fetchScreenings } from '@/features/screenings/api';

export function RoomDetailPage() {
  const params = useParams();
  const id = params.id ?? '';
  const nameParam = params.name ?? '';

  const query = useQuery({
    queryKey: ['screenings', 'room', id],
    queryFn: () => fetchScreenings({ roomId: id, from: new Date().toISOString() }),
    enabled: Boolean(id),
  });

  const name = () => {
    if (!nameParam) return '';
    return nameParam.charAt(0).toUpperCase() + nameParam.slice(1).replace('-', ' ');
  };

  if (query.isPending) {
    return <Loader overlay={false} />;
  }

  const details = query.data?.data ?? [];

  return (
    <Container>
      <Wrapper>
        <div className="wrapper__title">
          <span className="red"> Prochainement </span> au {name()}
        </div>
        <Card>
          {details.map((detail) => (
            <div className="card__movie" key={detail.id}>
              <div className="card__container">
                <Link to={`/programme/${detail.id}`}>
                  <div className="card__espace__image">
                    <img src={detail.movie?.posterUrl} className="card__image" alt="Image" />
                  </div>
                </Link>
              </div>
              <span className="movie__title"> {detail.movie?.title} </span>
            </div>
          ))}
        </Card>
      </Wrapper>
    </Container>
  );
}
