import { computeTotal } from '@/features/booking/types';

export function BookingSummary({
  selected,
  vipSeats,
  price,
  vipPrice,
  onPay,
}: {
  selected: number[];
  vipSeats: number[];
  price: number;
  vipPrice: number;
  onPay: () => void;
}) {
  const arrayStandard = selected.filter((seat) => !vipSeats.includes(seat));
  const arrayDeluxe = selected.filter((seat) => vipSeats.includes(seat));
  const standard = arrayStandard.length * price;
  const deluxe = arrayDeluxe.length * vipPrice;
  const total = computeTotal(selected, vipSeats, price, vipPrice);

  return (
    <>
      <span className="title"> Place sélectionnée </span>
      <div className="number__place">
        <span>
          {selected.length > 1 ? `${String(selected.length)} places` : `${String(selected.length)} place`}
        </span>
        <div className="place__selected">
          {selected.map((place) => (
            <span key={place}> P {place} </span>
          ))}
        </div>
      </div>
      <div className="total__payment">
        <div className="total__item">
          <div className="title__prix">Prix std</div>
          <div>{arrayStandard.length !== 0 ? arrayStandard.length : '-'}</div>
          <div className="prix"> {standard} € </div>
        </div>
        <div className="total__item">
          <div className="title__prix">Prix vip</div>
          <div> {arrayDeluxe.length !== 0 ? arrayDeluxe.length : '-'} </div>
          <div className="prix"> {deluxe} €</div>
        </div>
        <hr />
        <div className="total__item">
          <span>Total</span>
          <span> {total} €</span>
        </div>

        <button
          type="button"
          onClick={onPay}
          className="btn__payment"
          value="Paiement tickets"
          style={
            selected.length === 0
              ? {
                  backgroundColor: '#D6D8D9',
                  pointerEvents: 'none',
                }
              : { backgroundColor: '#01a8b8' }
          }
        >
          Paiement tickets
        </button>
      </div>
    </>
  );
}
