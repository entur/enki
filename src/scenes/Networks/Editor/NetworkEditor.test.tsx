import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from 'utils/test-utils';
import { mockNetworks, mockOrganisations } from 'mocks/mockData';

const mockNavigate = vi.fn();
let mockParams: Record<string, string> = {};

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { profile: { name: 'Test User' } },
    getAccessToken: vi.fn().mockResolvedValue('mock-token'),
  }),
  hasAuthParams: () => false,
}));

const preloadedState = {
  networks: mockNetworks as any,
  organisations: mockOrganisations as any,
  flexibleLines: [] as any,
};

const loadEditor = async () => {
  const mod = await import('./index');
  return mod.default;
};

describe('NetworkEditor', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockParams = {};
  });

  describe('create mode', () => {
    it('renders the create heading', async () => {
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });
      expect(
        screen.getByRole('heading', { name: /create network/i }),
      ).toBeInTheDocument();
    });

    it('renders empty name field', async () => {
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });
      expect(screen.getByLabelText(/^name/i)).toHaveValue('');
    });

    it('renders all form fields', async () => {
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });
      expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/private code/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/authority/i)).toBeInTheDocument();
    });

    it('renders a create button', async () => {
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });
      expect(
        screen.getByRole('button', { name: /create/i }),
      ).toBeInTheDocument();
    });

    it('does not render a delete button', async () => {
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });
      expect(
        screen.queryByRole('button', { name: /delete/i }),
      ).not.toBeInTheDocument();
    });

    it('allows typing in the name field', async () => {
      const user = userEvent.setup();
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });
      const nameField = screen.getByLabelText(/^name/i);
      await user.type(nameField, 'New Network');
      expect(nameField).toHaveValue('New Network');
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      mockParams = { id: 'TST:Network:1' };
    });

    it('renders the edit heading', async () => {
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });
      expect(
        screen.getByRole('heading', { name: /edit network/i }),
      ).toBeInTheDocument();
    });

    it('renders the network name in the name field', async () => {
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });
      expect(screen.getByLabelText(/^name/i)).toHaveValue('Ruter Flex');
    });

    it('renders a save button', async () => {
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('renders a delete button', async () => {
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });
      expect(
        screen.getByRole('button', { name: /delete/i }),
      ).toBeInTheDocument();
    });

    it('opens delete confirmation dialog on delete click', async () => {
      const user = userEvent.setup();
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(screen.getByText(/delete network/i)).toBeInTheDocument();
    });

    it('closes delete dialog on cancel click', async () => {
      const user = userEvent.setup();
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });

      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.getByText(/delete network/i)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /no/i }));
      await waitFor(() => {
        expect(
          screen.queryByRole('heading', { name: /delete network/i }),
        ).not.toBeInTheDocument();
      });
    });

    it('disables delete button when network is used by a line', async () => {
      const stateWithLinkedLines = {
        ...preloadedState,
        flexibleLines: [
          {
            id: 'TST:FlexibleLine:99',
            name: 'Line using network',
            networkRef: 'TST:Network:1',
            journeyPatterns: [],
          },
        ] as any,
      };
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState: stateWithLinkedLines });

      expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
    });

    it('allows typing in the description field', async () => {
      const user = userEvent.setup();
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });

      const descField = screen.getByLabelText(/description/i);
      await user.clear(descField);
      await user.type(descField, 'Updated description');
      expect(descField).toHaveValue('Updated description');
    });

    it('allows typing in the private code field', async () => {
      const user = userEvent.setup();
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });

      const privateCodeField = screen.getByLabelText(/private code/i);
      await user.type(privateCodeField, 'X');
      expect(privateCodeField).toHaveValue('RUTFLEXX');
    });
  });

  describe('save validation', () => {
    it('shows name validation error when saving with empty name', async () => {
      const user = userEvent.setup();
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });

      await user.click(screen.getByRole('button', { name: /create/i }));

      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    it('shows authority validation error when saving with empty authority', async () => {
      const user = userEvent.setup();
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, { preloadedState });

      const nameField = screen.getByLabelText(/^name/i);
      await user.type(nameField, 'Test Network');
      await user.click(screen.getByRole('button', { name: /create/i }));

      expect(screen.getByText('Authority is required')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('does not render the form when lines are not yet loaded', async () => {
      mockParams = { id: 'TST:Network:1' };
      const NetworkEditor = await loadEditor();
      render(<NetworkEditor />, {
        preloadedState: {
          ...preloadedState,
          flexibleLines: undefined as any,
        },
      });

      expect(screen.queryByLabelText(/^name/i)).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /save/i }),
      ).not.toBeInTheDocument();
    });
  });
});
