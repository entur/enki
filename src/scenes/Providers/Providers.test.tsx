import { vi } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import Providers from './index';
import { mockProviders } from '../../mocks/mockData';

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isLoading: false,
    isAuthenticated: true,
    user: { access_token: 'fake-token' },
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
    activeNavigator: undefined,
  }),
  hasAuthParams: () => false,
}));

describe('Providers listing', () => {
  const preloadedState = {
    providers: { providers: mockProviders } as any,
    userContext: { activeProviderCode: 'TST', isAdmin: true } as any,
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

  const config = {
    uttuApiUrl: 'https://mock-api',
    disableAuthentication: true,
  };

  it('renders the page header', () => {
    render(<Providers />, {
      routerProps: { initialEntries: ['/providers'] },
      preloadedState,
      config,
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Providers')).toBeInTheDocument();
  });

  it('renders provider names from mock data', () => {
    render(<Providers />, {
      routerProps: { initialEntries: ['/providers'] },
      preloadedState,
      config,
    });
    expect(screen.getByText('Ruter Flex')).toBeInTheDocument();
    expect(screen.getByText('AtB Flex')).toBeInTheDocument();
    expect(screen.getByText('Test provider')).toBeInTheDocument();
  });

  it('renders provider codes', () => {
    render(<Providers />, {
      routerProps: { initialEntries: ['/providers'] },
      preloadedState,
      config,
    });
    // Code and xmlns share the same value, so each appears twice per row
    expect(screen.getAllByText('RUT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('ATB').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('TST').length).toBeGreaterThanOrEqual(1);
  });

  it('renders codespace xmlns values', () => {
    render(<Providers />, {
      routerProps: { initialEntries: ['/providers'] },
      preloadedState,
      config,
    });
    expect(
      screen.getByText('http://www.rutebanken.org/ns/rut'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('http://www.rutebanken.org/ns/atb'),
    ).toBeInTheDocument();
  });

  it('renders the correct number of table rows', () => {
    render(<Providers />, {
      routerProps: { initialEntries: ['/providers'] },
      preloadedState,
      config,
    });
    // 1 header row + 3 data rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);
  });

  it('renders a create button linking to /providers/create', () => {
    render(<Providers />, {
      routerProps: { initialEntries: ['/providers'] },
      preloadedState,
      config,
    });
    const createLink = screen.getByRole('link');
    expect(createLink).toHaveAttribute('href', '/providers/create');
  });

  it('renders table column headers', () => {
    render(<Providers />, {
      routerProps: { initialEntries: ['/providers'] },
      preloadedState,
      config,
    });
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('XML namespace')).toBeInTheDocument();
    expect(screen.getByText('XML namespace url')).toBeInTheDocument();
  });

  it('redirects non-admin users away from the page', () => {
    render(<Providers />, {
      routerProps: { initialEntries: ['/providers'] },
      preloadedState: {
        ...preloadedState,
        userContext: { activeProviderCode: 'TST', isAdmin: false } as any,
      },
      config,
    });
    // Non-admin users should not see the providers heading
    expect(screen.queryByText('Providers')).not.toBeInTheDocument();
  });

  it('shows empty state when no providers', () => {
    render(<Providers />, {
      routerProps: { initialEntries: ['/providers'] },
      preloadedState: {
        ...preloadedState,
        providers: { providers: [] } as any,
      },
      config,
    });
    expect(
      screen.getByText(/needs at least one provider/i),
    ).toBeInTheDocument();
  });
});
