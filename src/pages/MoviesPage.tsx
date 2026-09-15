import Container from '@/styles/Container.js';
import { MovieRow } from '@/features/movies/MovieRow';

export function MoviesPage() {
  return (
    <Container>
      <MovieRow title="Future Cinéma" />
    </Container>
  );
}
