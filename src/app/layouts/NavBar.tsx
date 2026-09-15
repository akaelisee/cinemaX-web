import { useState } from 'react';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import HeaderStyle from '@/styles/HeaderStyle.js';
import NavLink from '@/styles/NavLink.js';
import NavLinkLeft from '@/styles/NavLinkLeft.js';
import { Logo } from '@/shared/ui/Logo';
import { useAuth } from '@/features/auth/useAuth';

export function NavBar({ isNav }: { isNav: boolean }) {
  const { user, logout } = useAuth();
  const [isResponsive, setIsResponsive] = useState(false);
  const [isUser, setIsUser] = useState(false);

  const deconnexion = () => {
    void logout().then(() => {
      window.location.reload();
    });
  };

  const initials = `${(user?.firstName ?? '').charAt(0)}${(user?.lastName ?? '').charAt(0)}`.toUpperCase();

  const userFuncScreen = () => {
    if (!user) {
      return (
        <div className="link">
          <Link to="/login"> Se connecter</Link>
          <Link to="/register"> S&lsquo;inscrire</Link>
        </div>
      );
    }
    return (
      <div className="compte__user">
        <ul className="user">
          <li>
            <span style={{ fontSize: '16px' }}>Bonjour {user.firstName ?? user.email} !</span>
            <ul className="popover">
              <li onClick={() => { deconnexion(); }}> Déconnexion </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  };

  const userFuncResponsive = () => {
    if (!user) {
      return (
        <div className="navbar__signin">
          <span
            onClick={() => {
              setIsResponsive(false);
              setIsUser(true);
            }}
          >
            <FontAwesomeIcon icon={faUser} />
          </span>
          {isUser ? (
            <NavLinkLeft expand>
              <div className="nav__responsive">
                <span
                  onClick={() => {
                    setIsUser(false);
                  }}
                  className="close__responsives"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </div>
              <div className="nav__link">
                <Link
                  className="btn-btn"
                  to="/login"
                  onClick={() => {
                    setIsUser(false);
                  }}
                >
                  identifiez-vous
                </Link>
                <Link
                  className="btn-btn compte"
                  to="/register"
                  onClick={() => {
                    setIsUser(false);
                  }}
                >
                  Créer votre compte
                </Link>
              </div>
            </NavLinkLeft>
          ) : (
            <></>
          )}
        </div>
      );
    }
    return (
      <div className="navbar__signin">
        <span
          style={{ cursor: 'pointer', fontSize: '16px' }}
            onClick={() => {
              setIsResponsive(false);
              setIsUser(true);
            }}
        >
          {initials || (user.email ?? '?').charAt(0).toUpperCase()}
        </span>
        {isUser ? (
          <NavLinkLeft expand>
            <div className="nav__responsive">
              <span
                onClick={() => {
                  setIsUser(false);
                }}
                className="close__responsives"
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            <div className="nav__link">
              <span
                onClick={() => {
                  deconnexion();
                }}
                className="btn-btn compte"
              >
                Déconnexion
              </span>
            </div>
          </NavLinkLeft>
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <HeaderStyle>
      <div
        className="navbar"
        style={isNav ? { backgroundColor: '' } : { backgroundColor: 'transparent' }}
      >
        <div className="screen">
          <div className="container_flex">
            <div className="navbar_logo">
              <div className="logo">
                <Logo />
              </div>
            </div>

            <div className="navbar__item">
              <div className="link">
                <Link to="/"> Accueil </Link>
                <Link to="/movie"> Films </Link>
                <Link to="/salle"> Salle de cinéma </Link>
                <Link to="/about"> À propos </Link>
                <Link to="/contact"> Contactez-Nous </Link>
              </div>
            </div>
            <div className="navbar__signin">{userFuncScreen()}</div>
          </div>
        </div>

        <div className="responsive__nav">
          <div className="container_flex">
            <div className="navbar_logo">
              <div className="bar">
                <span
                  onClick={() => {
                    setIsResponsive(true);
                  }}
                >
                  <FontAwesomeIcon icon={faBars} />
                </span>
              </div>
            </div>

            <div className="navbar__item">
              <div className="logo-link">
                <Logo />
              </div>
            </div>

            {userFuncResponsive()}
          </div>

          {isResponsive ? (
            <NavLink expand>
              <div className="nav__responsive">
                <span
                  onClick={() => {
                    setIsResponsive(false);
                  }}
                  className="close__responsive"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </div>
              <div className="nav__link">
                <Link
                  to="/"
                  onClick={() => {
                    setIsResponsive(false);
                  }}
                >
                  Accueil
                </Link>
                <Link
                  to="/movie"
                  onClick={() => {
                    setIsResponsive(false);
                  }}
                >
                  Films
                </Link>
                <Link
                  to="/salle"
                  onClick={() => {
                    setIsResponsive(false);
                  }}
                >
                  Salle de cinéma
                </Link>
                <Link
                  to="/about"
                  onClick={() => {
                    setIsResponsive(false);
                  }}
                >
                  À propos
                </Link>
                <Link
                  to="/contact"
                  onClick={() => {
                    setIsResponsive(false);
                  }}
                >
                  Contactez-Nous
                </Link>
              </div>
            </NavLink>
          ) : (
            <></>
          )}
        </div>
      </div>
    </HeaderStyle>
  );
}
