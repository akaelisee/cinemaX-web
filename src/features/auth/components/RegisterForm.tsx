import { useState, type FormEvent } from 'react';
import FormOut from '@/styles/FormOut.js';

export function RegisterForm({
  submitRegister,
  errorMessage,
  errorMessageEmail,
}: {
  submitRegister: (
    event: FormEvent<HTMLFormElement>,
    formRegister: { firstName: string; lastName: string; email: string; password: string },
    setIsError: (value: boolean) => void,
  ) => void;
  errorMessage: string;
  errorMessageEmail: string;
}) {
  const [formRegister, setFormRegister] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isError, setIsError] = useState(false);

  return (
    <FormOut>
      <div
        style={{
          color: '#ec2f4d',
          fontSize: '14px',
          marginBottom: '5px',
        }}
      >
        {errorMessageEmail}
      </div>
      <form
        onSubmit={(event) => {
          submitRegister(event, formRegister, setIsError);
        }}
      >
        <div className="">
          <div className="form_name">
            <div className="form-group">
              {formRegister.firstName.length > 0 ? (
                <input
                  type="text"
                  name="firstname"
                  placeholder="Prénom"
                  className="error_blue"
                  onChange={(event) => {
                    setFormRegister({
                      ...formRegister,
                      firstName: event.target.value,
                    });
                  }}
                />
              ) : (
                <input
                  type="text"
                  name="firstname"
                  placeholder="Prénom"
                  className={isError ? 'error_red' : ''}
                  onChange={(event) => {
                    setFormRegister({
                      ...formRegister,
                      firstName: event.target.value,
                    });
                  }}
                />
              )}
            </div>
            <div className="form-group">
              {formRegister.lastName.length > 0 ? (
                <input
                  type="text"
                  name="lastname"
                  placeholder="Nom"
                  onChange={(event) => {
                    setFormRegister({
                      ...formRegister,
                      lastName: event.target.value,
                    });
                  }}
                />
              ) : (
                <input
                  type="text"
                  name="lastname"
                  placeholder="Nom"
                  className={isError ? 'error_red' : ''}
                  onChange={(event) => {
                    setFormRegister({
                      ...formRegister,
                      lastName: event.target.value,
                    });
                  }}
                />
              )}
            </div>
          </div>
          {formRegister.firstName.length > 0 && formRegister.lastName.length > 0 ? (
            <> </>
          ) : (
            <div>
              {isError ? (
                <div style={{ color: '#ec2f4d', fontSize: '14px', margin: '1px' }}>
                  Veuillez indiquer vos nom et prénom.{' '}
                </div>
              ) : (
                <> </>
              )}
            </div>
          )}
        </div>
        <div className="form-info">
          <div className="form-group">
            {formRegister.email.length > 0 ? (
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={(event) => {
                  setFormRegister({
                    ...formRegister,
                    email: event.target.value,
                  });
                }}
              />
            ) : (
              <input
                type="email"
                name="email"
                className={isError ? 'error_red' : ''}
                placeholder="Email"
                onChange={(event) => {
                  setFormRegister({
                    ...formRegister,
                    email: event.target.value,
                  });
                }}
              />
            )}

            {formRegister.email.length > 0 ? (
              <> </>
            ) : (
              <div>
                {isError ? (
                  <div
                    style={{
                      color: '#ec2f4d',
                      fontSize: '14px',
                      margin: '1px',
                    }}
                  >
                    Veuillez entrer une adresse email.
                  </div>
                ) : (
                  <> </>
                )}
              </div>
            )}
          </div>
          <div className="form-group">
            {formRegister.password.length > 0 ? (
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                onChange={(event) => {
                  setFormRegister({
                    ...formRegister,
                    password: event.target.value,
                  });
                }}
              />
            ) : (
              <input
                type="password"
                name="password"
                className={isError ? 'error_red' : ''}
                placeholder="Mot de passe"
                onChange={(event) => {
                  setFormRegister({
                    ...formRegister,
                    password: event.target.value,
                  });
                }}
              />
            )}

            {formRegister.password.length > 0 ? (
              <>
                <div
                  style={{
                    color: '#ec2f4d',
                    fontSize: '14px',
                  }}
                >
                  {errorMessage}
                </div>
              </>
            ) : (
              <div>
                {isError ? (
                  <div
                    style={{
                      color: '#ec2f4d',
                      fontSize: '14px',
                      margin: '1px',
                    }}
                  >
                    Veuillez saisir un mot de passe.
                  </div>
                ) : (
                  <> </>
                )}
              </div>
            )}
          </div>
        </div>
        <button className="btn_register"> S&lsquo;inscrire </button>
      </form>
    </FormOut>
  );
}
