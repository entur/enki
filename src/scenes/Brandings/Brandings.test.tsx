import { render, screen, userEvent, waitFor } from '../../utils/test-utils';
import Brandings from './index';
import { mockBrandings, mockOrganisations } from '../../mocks/mockData';

describe('Brandings listing', () => {
  const preloadedState = {
    brandings: mockBrandings as any,
    organisations: mockOrganisations as any,
    userContext: { activeProviderCode: 'TST' } as any,
  };

  it('renders the page header', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState,
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders branding names', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState,
    });
    expect(screen.getByText('Ruter Flex')).toBeInTheDocument();
    expect(screen.getByText('AtB Flex')).toBeInTheDocument();
  });

  it('renders short names', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState,
    });
    expect(screen.getByText('RFlex')).toBeInTheDocument();
    expect(screen.getByText('AFlex')).toBeInTheDocument();
  });

  it('renders URLs', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState,
    });
    expect(screen.getByText('https://ruter.no/flex')).toBeInTheDocument();
    expect(screen.getByText('https://atb.no/flex')).toBeInTheDocument();
  });

  it('shows empty state when no brandings', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState: {
        ...preloadedState,
        brandings: [],
      },
    });
    expect(screen.getByText(/no brandings/i)).toBeInTheDocument();
  });

  it('renders a create button linking to /brandings/create', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState,
    });
    const createLink = screen.getByRole('link');
    expect(createLink).toHaveAttribute('href', '/brandings/create');
  });

  describe('delete confirmation dialog', () => {
    it('opens confirmation dialog when clicking delete button', async () => {
      const user = userEvent.setup();
      render(<Brandings />, {
        routerProps: { initialEntries: ['/brandings'] },
        preloadedState,
      });

      const deleteButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.id === 'delete-button');
      expect(deleteButtons.length).toBeGreaterThanOrEqual(1);

      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete branding')).toBeInTheDocument();
      });
      expect(
        screen.getByText('Are you sure you want to delete this branding?'),
      ).toBeInTheDocument();
    });

    it('dismisses dialog when clicking No', async () => {
      const user = userEvent.setup();
      render(<Brandings />, {
        routerProps: { initialEntries: ['/brandings'] },
        preloadedState,
      });

      const deleteButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.id === 'delete-button');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete branding')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'No' }));

      await waitFor(() => {
        expect(screen.queryByText('Delete branding')).not.toBeInTheDocument();
      });
    });
  });
});
