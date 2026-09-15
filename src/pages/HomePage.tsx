import { Link } from 'react-router';
import styled from 'styled-components';
import { RoomCarousel } from '@/features/rooms/RoomCarousel';
import { MovieRow } from '@/features/movies/MovieRow';
import Col from '@/styles/Col.js';
import Wrapper from '@/styles/Wrapper.js';
import { Image } from '@/styles/Card.js';
import salle5 from '@/assets/img/salle5.jpg';
import salle2 from '@/assets/img/salle3.jpg';

export function HomePage() {
  return (
    <Container>
      <RoomCarousel />
      <Wrapper>
        <Col>
          <div className="left">
            <Image home src={salle2} className="img-responsive" alt="Image" />
            <span className="title"> Visite generale </span>
            <div className="btn">
              <Link to="">Information Film</Link>
            </div>
          </div>
          <div className="left">
            <Image home src={salle5} className="img-responsive" alt="Image" />
            <span className="title"> Visite generale </span>
            <div className="btn">
              <Link to="">Information Reservation</Link>
            </div>
          </div>
        </Col>
      </Wrapper>
      <MovieRow title="Future Cinema" />
    </Container>
  );
}

const Container = styled.div`
  padding: 72px 0 0;
  flex: 1;
`;
