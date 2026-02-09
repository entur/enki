import { vi } from 'vitest';
import { render, screen, waitFor } from '../../utils/test-utils';
import Exports from './index';

// Mock react-oidc-context so useAuth() works without an OIDC provider
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

describe('Exports listing', () => {
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

  const config = {
    uttuApiUrl: 'https://mock-api',
    disableAuthentication: true,
  };

  it('renders the page header', () => {
    render(<Exports />, {
      routerProps: { initialEntries: ['/exports'] },
      preloadedState,
      config,
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders export names after loading from MSW', async () => {
    render(<Exports />, {
      routerProps: { initialEntries: ['/exports'] },
      preloadedState,
      config,
    });

    await waitFor(() => {
      expect(screen.getByText('Mars 2025 eksport')).toBeInTheDocument();
    });
    expect(screen.getByText('Test eksport (dry run)')).toBeInTheDocument();
    expect(screen.getByText('Feilet eksport')).toBeInTheDocument();
  });

  it('renders the correct number of data rows', async () => {
    render(<Exports />, {
      routerProps: { initialEntries: ['/exports'] },
      preloadedState,
      config,
    });

    await waitFor(() => {
      expect(screen.getByText('Mars 2025 eksport')).toBeInTheDocument();
    });
    // 1 header row + 3 data rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);
  });

  it('renders a create button linking to /exports/create', () => {
    render(<Exports />, {
      routerProps: { initialEntries: ['/exports'] },
      preloadedState,
      config,
    });
    const createLink = screen.getByRole('link');
    expect(createLink).toHaveAttribute('href', '/exports/create');
  });

  it('shows dry run column by default', async () => {
    render(<Exports />, {
      routerProps: { initialEntries: ['/exports'] },
      preloadedState,
      config,
    });

    await waitFor(() => {
      expect(screen.getByText('Mars 2025 eksport')).toBeInTheDocument();
    });
    // 5 columns: Name, Status, Created, Download, Dry Run
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(5);
  });

  it('hides dry run column when hideExportDryRun is true', async () => {
    render(<Exports />, {
      routerProps: { initialEntries: ['/exports'] },
      preloadedState,
      config: { ...config, hideExportDryRun: true },
    });

    await waitFor(() => {
      expect(screen.getByText('Mars 2025 eksport')).toBeInTheDocument();
    });
    // 4 columns: Name, Status, Created, Download (no Dry Run)
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(4);
  });
});
