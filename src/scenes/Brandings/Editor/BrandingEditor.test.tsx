import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
import { mockBrandings } from 'mocks/mockData';

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
  brandings: mockBrandings as any,
  organisations: [] as any,
};

// Lazy import so mocks are established first
const loadEditor = async () => {
  const mod = await import('./index');
  return mod.default;
};

describe('BrandingEditor', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockParams = {};
  });

  describe('create mode', () => {
    it('renders the create heading', async () => {
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      expect(
        screen.getByRole('heading', { name: /create branding/i }),
      ).toBeInTheDocument();
    });

    it('renders empty form fields', async () => {
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      expect(screen.getByLabelText(/^name/i)).toHaveValue('');
    });

    it('renders all form fields', async () => {
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/short name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^url$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    });

    it('renders a create button', async () => {
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      expect(
        screen.getByRole('button', { name: /create/i }),
      ).toBeInTheDocument();
    });

    it('does not render a delete button in create mode', async () => {
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      expect(
        screen.queryByRole('button', { name: /delete/i }),
      ).not.toBeInTheDocument();
    });

    it('allows typing in the name field', async () => {
      const user = userEvent.setup();
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      const nameField = screen.getByLabelText(/^name/i);
      await user.type(nameField, 'New Branding');
      expect(nameField).toHaveValue('New Branding');
    });

    it('allows typing in the description field', async () => {
      const user = userEvent.setup();
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      const descField = screen.getByLabelText(/description/i);
      await user.type(descField, 'Some description');
      expect(descField).toHaveValue('Some description');
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      mockParams = { id: 'TST:Branding:1' };
    });

    it('renders the edit heading', async () => {
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      expect(
        screen.getByRole('heading', { name: /edit branding/i }),
      ).toBeInTheDocument();
    });

    it('renders the branding name in the name field', async () => {
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      expect(screen.getByLabelText(/^name/i)).toHaveValue('Ruter Flex');
    });

    it('renders a save button', async () => {
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('renders a delete button', async () => {
      const BrandingEditor = await loadEditor();
      render(<BrandingEditor />, { preloadedState });
      expect(
        screen.getByRole('button', { name: /delete/i }),
      ).toBeInTheDocument();
    });
  });
});
