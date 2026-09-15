import { Link } from 'react-router';
import img404 from '@/assets/img/404.jpg';

export function NotFoundPage() {
  return (
    <div className="no__page">
      <div className="image">
        <img src={img404} alt="" />
      </div>
      <div className="btn_error">
        <Link to="/" style={{ color: '#071120' }}>
          Accueil
        </Link>
      </div>
    </div>
  );
}
