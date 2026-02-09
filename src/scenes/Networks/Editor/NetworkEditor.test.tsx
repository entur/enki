import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
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
  });
});
