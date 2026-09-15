import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import imageLogin from '@/assets/img/rigisterLogin.jpg';
import { LogoTwo } from '@/shared/ui/Logo';
import { SignInOut, ContentImage } from '@/styles/SignInOut.js';
import Loader from '@/shared/ui/Loader';
import { useAuth } from '@/features/auth/useAuth';
import { apiErrorMessage } from '@/shared/api/client';

export function RegisterPage() {
  const navigate = useNavigate();
  const { user, ready, register } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    if (ready && user) void navigate('/', { replace: true });
  }, [ready, user, navigate]);

  const submitRegister = (
    event: FormEvent<HTMLFormElement>,
    formRegister: { firstName: string; lastName: string; email: string; password: string },
    setIsError: (value: boolean) => void,
  ) => {
    event.preventDefault();
    if (!formRegister.firstName || !formRegister.lastName || !formRegister.password || !formRegister.email) {
      setIsError(true);
      return;
    }
    if (formRegister.password.length < 8) {
      setIsError(true);
      setErrorMessage('Veuillez entrer un mot de passe correct');
      return;
    }

    setIsLoader(true);
    void register(formRegister)
      .then(() => {
        void navigate('/');
      })
      .catch((error: unknown) => {
        setIsLoader(false);
        setErrorMessageEmail(
          apiErrorMessage(error) || 'Veuillez vous connecter avec le compte que vous avez déjà créé.',
        );
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
              <span className="title">Créer votre compte</span>
              <p className="text">Et rejoignez notre communauté .</p>
            </div>
          </div>
          <RegisterForm
            submitRegister={submitRegister}
            errorMessage={errorMessage}
            errorMessageEmail={errorMessageEmail}
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
              Déjà un compte ? <Link to="/login"> Connectez-vous </Link>
            </span>
          </div>
        </div>
        <div className="clear-register"> </div>
      </div>
    </SignInOut>
  );
}
