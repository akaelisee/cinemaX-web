import { useState, type FormEvent } from 'react';
import FormIn from '@/styles/FormIn.js';

export function LoginForm({
  submitLogin,
  errorMessageChamps,
  errorMessageLogin,
}: {
  submitLogin: (event: FormEvent<HTMLFormElement>, formLogin: { email: string; password: string }) => void;
  errorMessageChamps: string;
  errorMessageLogin: string;
}) {
  const [formLogin, setFormLogin] = useState({
    email: '',
    password: '',
  });

  return (
    <FormIn>
      <div
        style={{
          color: '#ec2f4d',
          fontSize: '14px',
          marginBottom: '5px',
        }}
      >
        {formLogin.email.length > 0 && formLogin.password.length > 0 ? '' : errorMessageChamps}
      </div>
      <div
        style={{
          color: '#ec2f4d',
          fontSize: '14px',
          marginBottom: '5px',
        }}
      >
        {errorMessageLogin}
      </div>
      <form
        onSubmit={(event) => {
          submitLogin(event, formLogin);
        }}
      >
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(event) => {
              setFormLogin({ ...formLogin, email: event.target.value });
            }}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            onChange={(event) => {
              setFormLogin({ ...formLogin, password: event.target.value });
            }}
          />
        </div>
        <button className="btn_login"> Se connecter </button>
      </form>
    </FormIn>
  );
}
