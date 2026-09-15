import { type FormEvent, type ReactNode, useState } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import StyleChekout from '@/styles/StyleChekout.js';
import { LoaderPayement } from '@/shared/ui/Loader';
import { confirmPayment, createReservation } from '@/features/booking/api';
import { apiErrorMessage, conflictSeats } from '@/shared/api/client';
import { conflictMessage } from '@/features/booking/types';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '';
const stripePromise = publishableKey.startsWith('pk_') ? loadStripe(publishableKey) : null;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

type CheckoutProps = {
  screeningId: string;
  selected: number[];
  onClose: () => void;
  onConflict: (seats: number[]) => void;
  onSuccess: () => void;
};

function CheckoutForm({ screeningId, selected, onClose, onConflict, onSuccess }: CheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutErrorMsg, setCheckoutErrorMsg] = useState('');
  const [buttonMsg, setButtonMsg] = useState<ReactNode>('Passer la commande');

  const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      setCheckoutErrorMsg('Paiement indisponible : Stripe n’est pas prêt.');
      return;
    }

    const form = event.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const address = (form.elements.namedItem('address') as HTMLInputElement).value;
    const city = (form.elements.namedItem('city') as HTMLInputElement).value;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCheckoutErrorMsg('Le champ carte n’est pas disponible.');
      return;
    }

    setIsProcessing(true);
    setButtonMsg(<LoaderPayement />);
    setCheckoutErrorMsg('');

    try {
      const reservation = await createReservation(screeningId, selected);
      if (!reservation.clientSecret) {
        setCheckoutErrorMsg('Le paiement n’a pas pu être initialisé.');
        setIsProcessing(false);
        setButtonMsg('Passer la commande');
        return;
      }

      const paymentMethodObj = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name,
          email,
          address: { line1: address, city },
        },
      });

      if (paymentMethodObj.error) {
        setCheckoutErrorMsg(paymentMethodObj.error.message ?? 'Carte invalide.');
        setIsProcessing(false);
        setButtonMsg('Passer la commande');
        return;
      }

      const confirm = await stripe.confirmCardPayment(reservation.clientSecret, {
        payment_method: paymentMethodObj.paymentMethod.id,
      });

      if (confirm.error) {
        setCheckoutErrorMsg(confirm.error.message ?? 'Paiement refusé.');
        setIsProcessing(false);
        setButtonMsg('Passer la commande');
        return;
      }

      await confirmPayment(reservation.id);
      setButtonMsg('Success! Payment is Complete');
      window.setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 2000);
    } catch (error) {
      const taken = conflictSeats(error);
      if (taken.length) {
        onConflict(taken);
        setCheckoutErrorMsg(conflictMessage(taken));
      } else {
        setCheckoutErrorMsg(apiErrorMessage(error));
      }
      setIsProcessing(false);
      setButtonMsg('Passer la commande');
    }
  };

  return (
    <StyleChekout>
      <div className="checkout__container">
        <div className="checkout__cart">
          <div className="checkout__title">
            <span> TRANSACTION </span>
          </div>
          <div className="checkout__close">
            <span
              onClick={() => {
                if (!isProcessing) onClose();
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
          <div className="grid__checkout">
            <div className="detail__payment">
              <form onSubmit={(event) => void handlePayment(event)}>
                <div className="form__card">
                  <div className="group">
                    <div className="form__group">
                      <label> Nom et prénom * </label>
                      <input type="text" name="name" required />
                    </div>
                    <div className="form__group">
                      <label> email *</label>
                      <input type="email" name="email" required />
                    </div>
                    <div
                      style={{
                        color: '#ec2f4d',
                        fontSize: '13px',
                        marginBottom: '0px',
                      }}
                    >
                      {checkoutErrorMsg}
                    </div>
                    <div className="form__group">
                      <label> Adresse *</label>
                      <input type="text" name="address" required />
                    </div>
                    <div className="form__group">
                      <label> Ville * </label>
                      <input type="text" name="city" required />
                    </div>
                  </div>
                </div>
                <div className="form__card">
                  <div className="group">
                    <div className="form__group">
                      <label> Carte </label>
                      <div className="element">
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="btn__checkout">
                  <button type="submit" disabled={isProcessing}>
                    {buttonMsg}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </StyleChekout>
  );
}

export function CheckoutDialog(props: CheckoutProps) {
  if (!stripePromise) {
    return (
      <StyleChekout>
        <div className="checkout__container">
          <div className="checkout__cart">
            <div className="checkout__title">
              <span> TRANSACTION </span>
            </div>
            <div className="checkout__close">
              <span onClick={props.onClose}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            <div
              style={{
                color: '#ec2f4d',
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              Paiement indisponible : ajoute VITE_STRIPE_PUBLISHABLE_KEY (pk_test_…) dans cinemaX-web/.env
              puis relance npm run dev.
            </div>
          </div>
        </div>
      </StyleChekout>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
