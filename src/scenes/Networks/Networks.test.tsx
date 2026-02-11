import { render, screen, userEvent, waitFor } from '../../utils/test-utils';
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

  describe('delete confirmation dialog', () => {
    it('opens confirmation dialog when clicking delete button', async () => {
      const user = userEvent.setup();
      render(<Networks />, {
        routerProps: { initialEntries: ['/networks'] },
        preloadedState,
      });

      const deleteButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.id === 'delete-button');
      expect(deleteButtons.length).toBeGreaterThanOrEqual(1);

      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete network')).toBeInTheDocument();
      });
      expect(
        screen.getByText('Are you sure you want to delete this network?'),
      ).toBeInTheDocument();
    });

    it('dismisses dialog when clicking No', async () => {
      const user = userEvent.setup();
      render(<Networks />, {
        routerProps: { initialEntries: ['/networks'] },
        preloadedState,
      });

      const deleteButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.id === 'delete-button');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete network')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'No' }));

      await waitFor(() => {
        expect(screen.queryByText('Delete network')).not.toBeInTheDocument();
      });
    });
  });
});
