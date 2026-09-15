import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { LoginForm } from '@/features/auth/components/LoginForm';
import imageLogin from '@/assets/img/rigisterLogin.jpg';
import { LogoTwo } from '@/shared/ui/Logo';
import { SignInOut, ContentImage } from '@/styles/SignInOut.js';
import Loader from '@/shared/ui/Loader';
import { useAuth } from '@/features/auth/useAuth';
import { apiErrorMessage } from '@/shared/api/client';

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, ready, login } = useAuth();
  const [errorMessageLogin, setErrorMessageLogin] = useState('');
  const [errorMessageChamps, setErrorMessageChamps] = useState('');
  const [isLoader, setIsLoader] = useState(false);

  const redirectTo = (() => {
    const value = params.get('redirect') ?? '/';
    return value.startsWith('/') ? value : '/';
  })();

  useEffect(() => {
    if (ready && user) void navigate(redirectTo, { replace: true });
  }, [ready, user, navigate, redirectTo]);

  const submitLogin = (event: FormEvent<HTMLFormElement>, formLogin: { email: string; password: string }) => {
    event.preventDefault();
    if (!formLogin.email || !formLogin.password) {
      setErrorMessageChamps('Veuillez remplir les champs');
      return;
    }
    if (formLogin.password.length < 6) {
      setErrorMessageChamps(' Veuillez entrer un mot de passe correct');
      return;
    }
    setIsLoader(true);
    void login(formLogin)
      .then(() => {
        void navigate(redirectTo);
      })
      .catch((error: unknown) => {
        setIsLoader(false);
        setErrorMessageLogin(apiErrorMessage(error) || 'Email ou mot de passe incorrect');
      });
  };

  if (isLoader) {
    return <Loader />;
  }

  return (
    <SignInOut>
      <ContentImage url={`url(${imageLogin})`} className="content_img" />
      <div className="content_signOut">
        <div className="component_formulaire">
          <div className="cards">
            <div className="logo">
              <LogoTwo />
            </div>
            <div className="group__btn">
              <span className="title">Identifiez-vous en 2 secondes</span>
              <p className="text">Et rejoignez notre communauté de .</p>
            </div>
          </div>
          <LoginForm
            submitLogin={submitLogin}
            errorMessageChamps={errorMessageChamps}
            errorMessageLogin={errorMessageLogin}
          />
          <div className="politique">
            En cliquant sur &quot;Connexion&quot; vous acceptez nos Conditions
            d&lsquo;utilisation. Veuillez consulter notre
            <span> Politique de confidentialité </span>. Ce site est protégé par
            reCAPTCHA et la <span>Politique de confidentialité </span> et les
            <span> Conditions d&lsquo;utilisation</span>
            Google s&lsquo;appliquent.
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '14px' }}>
              Pas de compte ? <Link to="/register"> Inscrivez-vous </Link>
            </span>
          </div>
        </div>
        <div className="clear"> </div>
      </div>
    </SignInOut>
  );
}
