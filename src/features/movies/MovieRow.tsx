import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Wrapper from '@/styles/Wrapper.js';
import { Card } from '@/styles/Card.js';
import { Loader } from '@/shared/ui/Loader';
import { fetchScreenings } from '@/features/screenings/api';
import { apiErrorMessage } from '@/shared/api/client';
import { uniqueMovieScreenings } from '@/features/booking/types';

export function MovieRow({ title }: { title: string }) {
  const query = useQuery({
    queryKey: ['screenings', 'catalogue'],
    queryFn: () => fetchScreenings({ from: new Date().toISOString() }),
  });

  if (query.isPending) {
    return <Loader overlay={false} />;
  }

  if (query.isError) {
    return (
      <Wrapper>
        <p
          style={{
            textAlign: 'center',
            fontSize: '16px',
            color: '#ec2f4d',
          }}
        >
          {apiErrorMessage(query.error)}
        </p>
      </Wrapper>
    );
  }

  const movies = uniqueMovieScreenings(query.data?.data ?? []);

  return (
    <Wrapper>
      {movies.length ? (
        <>
          <div className="wrapper__title">
            <span className="red"> Prochainement </span> à {title}
          </div>
          <Card>
            {movies.map((screening) => (
              <div className="card__movie" key={screening.id}>
                <div className="card__container">
                  <Link to={`/programme/${screening.id}`}>
                    <div className="card__espace__image">
                      <img
                        src={screening.movie?.posterUrl}
                        className="card__image"
                        alt="Image"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                </div>
                <span className="movie__title"> {screening.movie?.title} </span>
              </div>
            ))}
          </Card>
        </>
      ) : (
        <p
          style={{
            textAlign: 'center',
            fontSize: '22px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Pas de film actuellement
        </p>
      )}
    </Wrapper>
  );
}
