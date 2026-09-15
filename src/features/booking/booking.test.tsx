import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Seat } from '@/features/booking/components/Seat';
import { checkoutLoginPath, computeTotal, conflictMessage, seatStatus } from '@/features/booking/types';

describe('computeTotal', () => {
  it('mixe standard et VIP', () => {
    expect(computeTotal([1, 2, 10], [10, 11], 10, 25)).toBe(45);
  });
});

describe('seatStatus', () => {
  it('refuse un siège occupé', () => {
    expect(
      seatStatus({ seat: 4, vipSeats: [], takenSeats: [4], selected: [], conflictSeats: [] }),
    ).toBe('taken');
  });

  it('marque un conflit 409', () => {
    expect(
      seatStatus({ seat: 7, vipSeats: [], takenSeats: [], selected: [], conflictSeats: [7] }),
    ).toBe('conflict');
  });
});

describe('checkoutLoginPath', () => {
  it('redirige vers la connexion en mémorisant la séance', () => {
    expect(checkoutLoginPath('abc')).toBe('/login?redirect=/programme/abc');
  });
});

describe('conflictMessage', () => {
  it('affiche les sièges 409', () => {
    expect(conflictMessage([3, 8])).toBe('Place(s) déjà prise(s) : 3, 8');
  });
});

describe('Seat', () => {
  it('ne déclenche pas le clic si occupé', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Seat number={3} status="taken" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: /Siège 3/ }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('sélectionne un siège libre', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Seat number={3} status="free" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: /Siège 3/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
