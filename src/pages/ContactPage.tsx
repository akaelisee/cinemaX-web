import { useState, type FormEvent } from 'react';
import StyleContact from '@/styles/StyleContact.js';
import Container from '@/styles/Container.js';
import Wrapper from '@/styles/Wrapper.js';
import { sendContact } from '@/features/contact/api';
import { apiErrorMessage } from '@/shared/api/client';

export function ContactPage() {
  const [formContact, setFormContact] = useState({
    firstname: '',
    lastname: '',
    email: '',
    text: '',
  });
  const [isContactMsg, setIsContactMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const HandleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg('');
    void sendContact({
      name: `${formContact.firstname} ${formContact.lastname}`.trim(),
      subject: 'Contact',
      message: `${formContact.email}\n\n${formContact.text}`,
    })
      .then(() => {
        setIsContactMsg('Message envoyé');
      })
      .catch((error: unknown) => {
        setErrorMsg(apiErrorMessage(error));
      });
  };

  return (
    <Container>
      <Wrapper>
        <StyleContact>
          <div className="col">
            <div className="col__text">
              <span> Contactez-nous </span>
            </div>
          </div>
          <div className="form">
            <div
              style={{
                color: '#071120',
                fontSize: '28px',
                marginBottom: '0px',
                marginTop: '10px',
                textAlign: 'center',
              }}
            >
              {isContactMsg}
            </div>
            <div
              style={{
                color: '#ec2f4d',
                fontSize: '14px',
                marginBottom: '5px',
                textAlign: 'center',
              }}
            >
              {errorMsg}
            </div>
            <form
              onSubmit={(event) => {
                HandleSubmit(event);
              }}
            >
              <div className="form__card">
                <div className="group">
                  <div className="form__group">
                    <label> Prenom * </label>
                    <input
                      type="text"
                      name="firstname"
                      placeholder="Nom"
                      className="form-control"
                      onChange={(event) => {
                        setFormContact({
                          ...formContact,
                          firstname: event.target.value,
                        });
                      }}
                      required
                    />
                  </div>
                  <div className="form__group">
                    <label> Nom * </label>
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Nom"
                      className="form-control"
                      onChange={(event) => {
                        setFormContact({
                          ...formContact,
                          lastname: event.target.value,
                        });
                      }}
                      required
                    />
                  </div>
                  <div className="form__group">
                    <label> Email *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="email"
                      className="form-control"
                      onChange={(event) => {
                        setFormContact({
                          ...formContact,
                          email: event.target.value,
                        });
                      }}
                      required
                    />
                  </div>
                  <div className="form__group">
                    <label> Commentaire *</label>
                    <textarea
                      name="text"
                      rows={5}
                      placeholder="message"
                      className="form-control"
                      onChange={(event) => {
                        setFormContact({
                          ...formContact,
                          text: event.target.value,
                        });
                      }}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="btn__contact">
                <button type="submit" className="submit-btn btn">
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </StyleContact>
      </Wrapper>
    </Container>
  );
}
