import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
import { mockProviders } from 'mocks/mockData';

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
  providers: {
    providers: mockProviders as any,
    failure: false,
    exports: null,
  },
};

const configValue = {
  xmlnsUrlPrefix: 'http://www.rutebanken.org/ns/',
  uttuApiUrl: 'http://localhost:11701/services/flexible-lines',
  disableAuthentication: true,
};

const loadEditor = async () => {
  const mod = await import('./index');
  return mod.default;
};

describe('ProviderEditor', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockParams = {};
  });

  const renderOpts = {
    preloadedState,
    config: configValue,
    routerProps: { initialEntries: ['/providers/create'] },
  };

  describe('create mode', () => {
    it('renders the create heading', async () => {
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, renderOpts);
      expect(
        screen.getByRole('heading', { name: /create provider/i }),
      ).toBeInTheDocument();
    });

    it('renders name field empty', async () => {
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, renderOpts);
      expect(screen.getByLabelText(/^name/i)).toHaveValue('');
    });

    it('renders all form fields', async () => {
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, renderOpts);
      expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^code/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/xml namespace \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/xml namespace url/i)).toBeInTheDocument();
    });

    it('renders a create button', async () => {
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, renderOpts);
      expect(
        screen.getByRole('button', { name: /create/i }),
      ).toBeInTheDocument();
    });

    it('does not render the migrate lines button', async () => {
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, renderOpts);
      expect(
        screen.queryByRole('link', { name: /migrate/i }),
      ).not.toBeInTheDocument();
    });

    it('allows typing in the name field', async () => {
      const user = userEvent.setup();
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, renderOpts);
      const nameField = screen.getByLabelText(/^name/i);
      await user.type(nameField, 'My Provider');
      expect(nameField).toHaveValue('My Provider');
    });

    it('code field auto-derives codespace fields', async () => {
      const user = userEvent.setup();
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, renderOpts);
      const codeField = screen.getByLabelText(/^code/i);
      await user.type(codeField, 'abc');
      expect(codeField).toHaveValue('abc');
      expect(screen.getByLabelText(/xml namespace \*/i)).toHaveValue('ABC');
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      mockParams = { id: 'TST' };
    });

    const editOpts = {
      preloadedState,
      config: configValue,
      routerProps: { initialEntries: ['/providers/edit/TST'] },
    };

    it('renders the edit heading', async () => {
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, editOpts);
      expect(
        screen.getByRole('heading', { name: /edit provider/i }),
      ).toBeInTheDocument();
    });

    it('renders the provider name in the name field', async () => {
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, editOpts);
      expect(screen.getByLabelText(/^name/i)).toHaveValue('Test provider');
    });

    it('renders a save button', async () => {
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, editOpts);
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('disables the code field in edit mode', async () => {
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, editOpts);
      expect(screen.getByLabelText(/^code/i)).toBeDisabled();
    });

    it('renders the migrate lines link', async () => {
      const ProviderEditor = await loadEditor();
      render(<ProviderEditor />, editOpts);
      expect(
        screen.getByRole('link', { name: /migrate/i }),
      ).toBeInTheDocument();
    });
  });
});
