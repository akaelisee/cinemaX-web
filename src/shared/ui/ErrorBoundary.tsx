import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { message: string | null };

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { message: null };

  static getDerivedStateFromError(error: Error): State {
    return { message: error.message };
  }

  override componentDidCatch(): void {
    // L'état est déjà posé par getDerivedStateFromError.
  }

  override render(): ReactNode {
    if (this.state.message) {
      return (
        <main style={{ padding: '90px 24px', textAlign: 'center', color: '#fff' }}>
          <h1>Quelque chose s’est mal passé</h1>
          <p style={{ color: '#ec2f4d', fontSize: '14px' }}>{this.state.message}</p>
          <button
            type="button"
            className="btn_error"
            onClick={() => {
              this.setState({ message: null });
              window.location.reload();
            }}
          >
            Recharger la page
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
