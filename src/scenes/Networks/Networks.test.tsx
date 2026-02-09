import { render, screen, waitFor } from '../../utils/test-utils';
import Networks from './index';
import { mockNetworks, mockOrganisations } from '../../mocks/mockData';

describe('Networks listing', () => {
  const preloadedState = {
    networks: mockNetworks as any,
    organisations: mockOrganisations as any,
    userContext: { activeProviderCode: 'TST' } as any,
  };

  it('renders the page header', () => {
    render(<Networks />, {
      routerProps: { initialEntries: ['/networks'] },
      preloadedState,
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders network names from mock data', () => {
    render(<Networks />, {
      routerProps: { initialEntries: ['/networks'] },
      preloadedState,
    });
    expect(screen.getByText('Ruter Flex')).toBeInTheDocument();
    expect(screen.getByText('AtB Flex')).toBeInTheDocument();
  });

  it('renders private codes', () => {
    render(<Networks />, {
      routerProps: { initialEntries: ['/networks'] },
      preloadedState,
    });
    expect(screen.getByText('RUTFLEX')).toBeInTheDocument();
    expect(screen.getByText('ATBFLEX')).toBeInTheDocument();
  });

  it('resolves authority names from organisations', () => {
    render(<Networks />, {
      routerProps: { initialEntries: ['/networks'] },
      preloadedState,
    });
    expect(screen.getByText('Ruter AS')).toBeInTheDocument();
    expect(screen.getByText('AtB AS')).toBeInTheDocument();
  });

  it('shows empty state when no networks', () => {
    render(<Networks />, {
      routerProps: { initialEntries: ['/networks'] },
      preloadedState: {
        ...preloadedState,
        networks: [],
      },
    });
    // The component shows a "no networks found" message
    expect(screen.getByText(/no networks/i)).toBeInTheDocument();
  });

  it('renders a create button linking to /networks/create', () => {
    render(<Networks />, {
      routerProps: { initialEntries: ['/networks'] },
      preloadedState,
    });
    const createLink = screen.getByRole('link');
    expect(createLink).toHaveAttribute('href', '/networks/create');
  });
});
