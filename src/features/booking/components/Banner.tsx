import Banniere from '@/styles/Banniere.js';
import Wrapper from '@/styles/Wrapper.js';
import play from '@/assets/svg/play-outline.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import type { ProgrammeView } from '@/features/booking/types';

export function Banner({ programmes }: { programmes: ProgrammeView[] }) {
  return (
    <>
      {programmes.map((programme) => (
        <div className="col__pro" key={programme.id}>
          <Banniere url={`url(${programme.backdrop_path})`} />

          <div className="pro__backdrop">
            <Wrapper>
              <div className="wrapper__pro">
                <div className="wrapper__pro__image">
                  <img src={programme.poster_path} className="img-responsive" alt="Image" />
                </div>
                <div className="wrapper__pro__detail">
                  <div className="pro__title">
                    <span> {programme.movie} </span>
                  </div>
                  <div className="pro__desc">
                    <span> {programme.overview} </span>
                  </div>
                  <div className="pro__btn_view">
                    <button type="button" className="btn">
                      <img src={play} alt="Image" />
                      <span> Résumé </span>
                    </button>
                  </div>
                  <div className="pro__duree">
                    <div className="imdb">
                      <span className="yellow">IMDb</span>
                      &nbsp;
                      <span> 66/10 </span>
                    </div>
                    <div className="time">
                      <span>
                        <FontAwesomeIcon icon={faClock} />
                      </span>
                      &nbsp;&nbsp;
                      <span> {programme.duree} </span>
                    </div>
                  </div>
                </div>
              </div>
            </Wrapper>
          </div>
        </div>
      ))}
    </>
  );
}
