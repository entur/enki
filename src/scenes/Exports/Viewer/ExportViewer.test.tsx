import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import ExportsViewer from './index';
import { mockExports } from 'mocks/mockData';
import { Export } from 'model/Export';

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { profile: { name: 'Test User' }, access_token: 'fake-token' },
    logout: vi.fn(),
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
    getAccessToken: vi.fn().mockResolvedValue('fake-token'),
  }),
  hasAuthParams: () => false,
}));

vi.mock('actions/exports', () => ({
  loadExportById: vi.fn(() => () => Promise.resolve()),
  requestExports: vi.fn(),
  receiveExports: vi.fn(),
  receiveExport: vi.fn(),
}));

let mockParamsId = 'TST:Export:1';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: mockParamsId }),
  };
});

const successExport = mockExports[0] as unknown as Export;
const failedExport = mockExports[2] as unknown as Export;

const defaultState = {
  userContext: {
    providers: [{ name: 'Test', code: 'TST' }] as any,
    activeProviderCode: 'TST',
    isAdmin: false,
    loaded: true,
    preferredName: '',
  },
};

describe('ExportViewer', () => {
  beforeEach(() => {
    mockParamsId = 'TST:Export:1';
  });

  it('renders export name for a successful export', () => {
    render(<ExportsViewer />, {
      preloadedState: {
        ...defaultState,
        exports: [successExport],
      },
      routerProps: { initialEntries: ['/exports/view'] },
    });

    expect(screen.getByText('Mars 2025 eksport')).toBeInTheDocument();
  });

  it('renders export status label', () => {
    render(<ExportsViewer />, {
      preloadedState: {
        ...defaultState,
        exports: [successExport],
      },
      routerProps: { initialEntries: ['/exports/view'] },
    });

    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders download button for successful export', () => {
    render(<ExportsViewer />, {
      preloadedState: {
        ...defaultState,
        exports: [successExport],
      },
      routerProps: { initialEntries: ['/exports/view'] },
    });

    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('does not render download button for failed export', () => {
    mockParamsId = 'TST:Export:3';
    render(<ExportsViewer />, {
      preloadedState: {
        ...defaultState,
        exports: [failedExport],
      },
      routerProps: { initialEntries: ['/exports/view'] },
    });

    expect(screen.queryByText('Download')).not.toBeInTheDocument();
  });

  it('renders generate service links label', () => {
    render(<ExportsViewer />, {
      preloadedState: {
        ...defaultState,
        exports: [successExport],
      },
      routerProps: { initialEntries: ['/exports/view'] },
    });

    expect(screen.getByText('Generate service links')).toBeInTheDocument();
  });

  it('renders dry run field when not hidden', () => {
    render(<ExportsViewer />, {
      preloadedState: {
        ...defaultState,
        exports: [successExport],
      },
      routerProps: { initialEntries: ['/exports/view'] },
    });

    expect(screen.getByText('Dry run')).toBeInTheDocument();
  });

  it('hides dry run field when hideExportDryRun config is true', () => {
    render(<ExportsViewer />, {
      preloadedState: {
        ...defaultState,
        exports: [successExport],
      },
      routerProps: { initialEntries: ['/exports/view'] },
      config: { hideExportDryRun: true },
    });

    expect(screen.queryByText('Dry run')).not.toBeInTheDocument();
  });

  it('renders messages when present', () => {
    render(<ExportsViewer />, {
      preloadedState: {
        ...defaultState,
        exports: [successExport],
      },
      routerProps: { initialEntries: ['/exports/view'] },
    });

    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(
      screen.getByText('Export completed successfully'),
    ).toBeInTheDocument();
  });

  it('renders error messages for failed export', () => {
    mockParamsId = 'TST:Export:3';
    render(<ExportsViewer />, {
      preloadedState: {
        ...defaultState,
        exports: [failedExport],
      },
      routerProps: { initialEntries: ['/exports/view'] },
    });

    expect(
      screen.getByText('Validation failed: missing required fields'),
    ).toBeInTheDocument();
  });

  it('renders the back button pointing to Exports', () => {
    render(<ExportsViewer />, {
      preloadedState: {
        ...defaultState,
        exports: [successExport],
      },
      routerProps: { initialEntries: ['/exports/view'] },
    });

    expect(screen.getByText('Exports')).toBeInTheDocument();
  });
});
