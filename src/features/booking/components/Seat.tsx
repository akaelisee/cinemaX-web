import type { ButtonHTMLAttributes } from 'react';
import type { SeatStatus } from '@/features/booking/types';

const labels: Record<SeatStatus, string> = {
  free: 'libre',
  vip: 'VIP libre',
  selected: 'sélectionné',
  taken: 'occupé',
  conflict: 'vient d’être pris',
};

const defaultContent = {
  display: 'inline-block',
  padding: '10px',
  margin: '4px',
  cursor: 'pointer',
  outline: 'none',
} as const;

const content = {
  ...defaultContent,
  border: '1px solid #e68c2f',
  backgroundColor: '#e68c2f',
};

const content1 = {
  ...defaultContent,
  border: '1px solid #008799',
  backgroundColor: '#015767',
};

const content2 = {
  ...defaultContent,
  border: '1px solid #00eaff',
  backgroundColor: '#00eaff',
};

export function Seat({
  number,
  status,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { number: number; status: SeatStatus }) {
  const taken = status === 'taken' || status === 'conflict';
  const style = taken ? content2 : status === 'selected' ? content : content1;

  return (
    <button
      type="button"
      disabled={taken || props.disabled}
      aria-pressed={status === 'selected'}
      aria-label={`Siège ${String(number)}, ${labels[status]}`}
      className={status === 'vip' || status === 'selected' ? 'cube deluxe' : 'cube available'}
      style={style}
      {...props}
    />
  );
}
