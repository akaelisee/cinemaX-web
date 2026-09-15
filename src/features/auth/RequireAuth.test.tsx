import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { AuthContext } from '@/features/auth/useAuth';
import type { AuthContextValue } from '@/features/auth/useAuth';

function stub(user: AuthContextValue['user']): AuthContextValue {
  return {
    user,
    ready: true,
    login: async () => undefined,
    register: async () => undefined,
    logout: async () => undefined,
  };
}

describe('RequireAuth', () => {
  it('envoie vers /login avec redirect', () => {
    render(
      <AuthContext.Provider value={stub(null)}>
        <MemoryRouter initialEntries={['/screenings/42']}>
          <Routes>
            <Route
              path="/screenings/:id"
              element={
                <RequireAuth>
                  <p>privé</p>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<p>login</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByText('login')).toBeInTheDocument();
  });

  it('laisse passer un client connecté', () => {
    render(
      <AuthContext.Provider
        value={stub({ id: '1', role: 'CLIENT', email: 'a@b.c', firstName: 'Ada' })}
      >
        <MemoryRouter initialEntries={['/pay']}>
          <Routes>
            <Route
              path="/pay"
              element={
                <RequireAuth>
                  <p>ok</p>
                </RequireAuth>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByText('ok')).toBeInTheDocument();
  });
});

describe('sélection de sièges', () => {
  it('ajoute et retire un siège', async () => {
    const { useSeatSelection } = await import('@/features/booking/useSeatSelection');
    function Probe() {
      const { selected, toggle } = useSeatSelection('s1', []);
      return (
        <div>
          <button type="button" onClick={() => { toggle(5); }}>
            t
          </button>
          <span>{selected.join(',')}</span>
        </div>
      );
    }
    const user = userEvent.setup();
    sessionStorage.clear();
    render(<Probe />);
    await user.click(screen.getByRole('button', { name: 't' }));
    expect(screen.getByText('5')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 't' }));
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });
});
