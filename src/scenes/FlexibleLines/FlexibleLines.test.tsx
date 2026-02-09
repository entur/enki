import { render, screen, userEvent, waitFor } from '../../utils/test-utils';
import FlexibleLines from './index';
import { mockFlexibleLines, mockOrganisations } from '../../mocks/mockData';

describe('FlexibleLines listing', () => {
  const preloadedState = {
    flexibleLines: mockFlexibleLines as any,
    organisations: mockOrganisations as any,
  };

  it('renders the page header', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders flexible line names', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    expect(screen.getByText('Fleksirute Oslo Sentrum')).toBeInTheDocument();
    expect(screen.getByText('Bygdøy Ferge Flex')).toBeInTheDocument();
  });

  it('renders public codes', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    expect(screen.getByText('F101')).toBeInTheDocument();
    expect(screen.getByText('F102')).toBeInTheDocument();
  });

  it('renders private codes', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    expect(screen.getByText('FLEX101')).toBeInTheDocument();
    expect(screen.getByText('FLEX102')).toBeInTheDocument();
  });

  it('resolves operator names from organisations', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    expect(screen.getByText('Vy Buss AS')).toBeInTheDocument();
    expect(screen.getByText('Boreal Transport')).toBeInTheDocument();
  });

  it('renders a create button linking to /flexible-lines/create', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    const createLink = screen.getByRole('link');
    expect(createLink).toHaveAttribute('href', '/flexible-lines/create');
  });

  describe('delete confirmation dialog', () => {
    it('opens confirmation dialog when clicking delete button', async () => {
      const user = userEvent.setup();
      render(<FlexibleLines />, {
        routerProps: { initialEntries: ['/flexible-lines'] },
        preloadedState,
      });

      const deleteButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.id === 'delete-button');
      expect(deleteButtons.length).toBeGreaterThanOrEqual(1);

      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete line')).toBeInTheDocument();
      });
      expect(
        screen.getByText('Are you sure you want to delete this line?'),
      ).toBeInTheDocument();
    });

    it('dismisses dialog when clicking No', async () => {
      const user = userEvent.setup();
      render(<FlexibleLines />, {
        routerProps: { initialEntries: ['/flexible-lines'] },
        preloadedState,
      });

      const deleteButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.id === 'delete-button');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete line')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'No' }));

      await waitFor(() => {
        expect(screen.queryByText('Delete line')).not.toBeInTheDocument();
      });
    });
  });
});
