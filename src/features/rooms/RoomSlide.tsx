import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styled from 'styled-components';
import salle6 from '@/assets/img/salle6.jpg';
import salle5 from '@/assets/img/salle5.jpg';
import salle4 from '@/assets/img/salle4.jpg';
import type { Room } from '@/shared/api/types';

const imageSalle = [salle6, salle5, salle4, salle6];
const regex = / /gi;

export function RoomSlide({ rooms }: { rooms: Room[] }) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    setNavReady(true);
  }, []);

  if (!rooms?.length) return null;

  return (
    <SlideSwiper>
      <button ref={prevRef} type="button" className="salle-nav salle-prev" aria-label="Salle précédente">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button ref={nextRef} type="button" className="salle-nav salle-next" aria-label="Salle suivante">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      {navReady ? (
        <Swiper
          className="swiper-container"
          modules={[EffectFade, Pagination, Navigation, Autoplay]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={700}
          rewind={rooms.length > 1}
          preventClicks={false}
          preventClicksPropagation={false}
          autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
        >
          {rooms.map((item, index) => (
            <SwiperSlide key={item.id}>
              <div className="group__salle">
                <img
                  src={imageSalle[index % imageSalle.length] ?? salle6}
                  className="img-responsive"
                  alt=""
                />
                <div className="position__salle">
                  <span className="salle__kicker">Salle</span>
                  <span className="salle__title">{item.name}</span>
                  <div className="btn__salle">
                    <Link
                      to={`/detail/${item.name.replace(regex, '-').toLowerCase()}/${item.id}`}
                    >
                      Plus d&lsquo;info
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
    </SlideSwiper>
  );
}

const SlideSwiper = styled.div`
  position: relative;
  width: 100%;

  .swiper-container,
  .swiper {
    width: 100%;
  }

  .swiper-slide {
    width: 100%;
  }

  .group__salle {
    position: relative;
    width: 100%;
    min-height: 520px;

    img {
      display: block;
      width: 100%;
      height: 72vh;
      min-height: 520px;
      max-height: 720px;
      object-fit: cover;
    }

    .position__salle {
      position: absolute;
      inset: 0;
      z-index: 5;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 0 8% 72px;
      background: linear-gradient(
        90deg,
        rgba(6, 40, 60, 0.82) 0%,
        rgba(6, 40, 60, 0.35) 48%,
        rgba(6, 40, 60, 0.12) 100%
      );

      .salle__kicker {
        font-size: 13px;
        letter-spacing: 4px;
        text-transform: uppercase;
        color: #f5c518;
        margin-bottom: 10px;
      }

      .salle__title {
        display: block;
        font-size: 48px;
        line-height: 1.1;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
        max-width: 16ch;
      }

      .btn__salle {
        padding-top: 28px;

        a {
          display: inline-block;
          padding: 12px 40px;
          border: 1px solid #fff;
          text-decoration: none;
          color: #fff;
          font-size: 15px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 1px;

          &:hover {
            background-color: #fff;
            transition: all 0.35s ease;
            color: #06283c;
          }
        }
      }
    }
  }

  .salle-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 8;
    width: 52px;
    height: 52px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    background: rgba(6, 40, 60, 0.4);
    color: #fff;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(6, 40, 60, 0.85);
    }
  }

  .salle-prev {
    left: 24px;
  }

  .salle-next {
    right: 24px;
  }

  .swiper-pagination {
    bottom: 22px !important;
  }

  .swiper-pagination-bullet {
    background: #fff;
    opacity: 0.4;
    width: 9px;
    height: 9px;
  }

  .swiper-pagination-bullet-active {
    opacity: 1;
    background: #f5c518;
  }

  @media screen and (max-width: 1110px) {
    .group__salle {
      min-height: 420px;
      img {
        height: 58vh;
        min-height: 420px;
      }
      .position__salle {
        padding: 0 72px 56px;
        .salle__title {
          font-size: 34px;
        }
      }
    }
  }

  @media screen and (max-width: 600px) {
    .salle-nav {
      width: 40px;
      height: 40px;
      font-size: 14px;
    }
    .salle-prev {
      left: 10px;
    }
    .salle-next {
      right: 10px;
    }
    .group__salle {
      min-height: 320px;
      img {
        height: 52vh;
        min-height: 320px;
        max-height: 480px;
      }
      .position__salle {
        padding: 0 20px 48px;
        .salle__title {
          font-size: 24px;
        }
        .btn__salle {
          padding-top: 18px;
          a {
            padding: 10px 24px;
            font-size: 13px;
          }
        }
      }
    }
  }
`;
