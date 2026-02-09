import { render, screen, waitFor } from '../../utils/test-utils';
import StopPlaces from './index';

describe('StopPlaces listing', () => {
  const preloadedState = {
    userContext: { activeProviderCode: 'TST' } as any,
    auth: {
      loaded: true,
      isLoading: false,
      isAuthenticated: true,
      getAccessToken: () => Promise.resolve('fake-token'),
      logout: () => Promise.resolve(),
      login: () => Promise.resolve(),
    } as any,
    config: {
      loaded: true,
      uttuApiUrl: 'https://mock-api',
    } as any,
  };

  it('renders the page header', () => {
    render(<StopPlaces />, {
      routerProps: { initialEntries: ['/stop-places'] },
      preloadedState,
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders stop place names after loading from MSW', async () => {
    render(<StopPlaces />, {
      routerProps: { initialEntries: ['/stop-places'] },
      preloadedState,
    });

    await waitFor(() => {
      expect(screen.getByText('Oslo Sentrum Sone')).toBeInTheDocument();
    });
    expect(screen.getByText('Grünerløkka Sone')).toBeInTheDocument();
    expect(screen.getByText('Bygdøy Sone')).toBeInTheDocument();
  });

  it('renders private codes', async () => {
    render(<StopPlaces />, {
      routerProps: { initialEntries: ['/stop-places'] },
      preloadedState,
    });

    await waitFor(() => {
      expect(screen.getByText('OSLOSONE1')).toBeInTheDocument();
    });
    expect(screen.getByText('GRLSONE1')).toBeInTheDocument();
    expect(screen.getByText('BYGDSONE1')).toBeInTheDocument();
  });

  it('renders number of flexible areas', async () => {
    render(<StopPlaces />, {
      routerProps: { initialEntries: ['/stop-places'] },
      preloadedState,
    });

    await waitFor(() => {
      expect(screen.getByText('Oslo Sentrum Sone')).toBeInTheDocument();
    });
    // Each stop place has 1 flexible area
    const areaCounts = screen.getAllByText('1');
    expect(areaCounts.length).toBeGreaterThanOrEqual(3);
  });

  it('renders a create button linking to /stop-places/create', () => {
    render(<StopPlaces />, {
      routerProps: { initialEntries: ['/stop-places'] },
      preloadedState,
    });
    const createLink = screen.getByRole('link');
    expect(createLink).toHaveAttribute('href', '/stop-places/create');
  });
});
