import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from '@/app/router';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0, staleTime: 60_000, refetchOnWindowFocus: false },
  },
});

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
