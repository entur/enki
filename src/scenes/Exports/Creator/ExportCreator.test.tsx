import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
import ExportsCreator from './index';

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { profile: { name: 'Test User' }, access_token: 'fake-token' },
    logout: vi.fn(),
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
  }),
  hasAuthParams: () => false,
}));

vi.mock('components/LinesForExport', () => ({
  default: ({ onChange }: { onChange: (lines: any[]) => void }) => (
    <div data-testid="lines-for-export">LinesForExport Mock</div>
  ),
}));

const defaultState = {
  userContext: {
    providers: [{ name: 'Test', code: 'TST' }] as any,
    activeProviderCode: 'TST',
    isAdmin: false,
    preferredName: 'Test User',
    loaded: true,
  },
  editor: { isSaved: true },
} as const;

describe('ExportCreator', () => {
  it('renders the page title', () => {
    render(<ExportsCreator />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/exports/create'] },
    });

    expect(
      screen.getByRole('heading', { name: 'Create export' }),
    ).toBeInTheDocument();
  });

  it('renders the name input field', () => {
    render(<ExportsCreator />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/exports/create'] },
    });

    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
  });

  it('renders the generate service links checkbox', () => {
    render(<ExportsCreator />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/exports/create'] },
    });

    expect(screen.getByLabelText('Generate service links')).toBeInTheDocument();
  });

  it('renders the include dated service journeys checkbox', () => {
    render(<ExportsCreator />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/exports/create'] },
    });

    expect(
      screen.getByLabelText(/Generate DatedServiceJourneys/),
    ).toBeInTheDocument();
  });

  it('renders the dry run checkbox when not hidden', () => {
    render(<ExportsCreator />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/exports/create'] },
    });

    expect(screen.getByLabelText('Dry run')).toBeInTheDocument();
  });

  it('hides the dry run checkbox when hideExportDryRun is true', () => {
    render(<ExportsCreator />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/exports/create'] },
      config: { hideExportDryRun: true },
    });

    expect(screen.queryByLabelText('Dry run')).not.toBeInTheDocument();
  });

  it('renders the save button', () => {
    render(<ExportsCreator />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/exports/create'] },
    });

    expect(
      screen.getByRole('button', { name: 'Create export' }),
    ).toBeInTheDocument();
  });

  it('renders the LinesForExport section', () => {
    render(<ExportsCreator />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/exports/create'] },
    });

    expect(screen.getByText('Choose lines to export')).toBeInTheDocument();
    expect(screen.getByTestId('lines-for-export')).toBeInTheDocument();
  });

  it('allows toggling the dry run checkbox', async () => {
    const user = userEvent.setup();
    render(<ExportsCreator />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/exports/create'] },
    });

    const dryRunCheckbox = screen.getByLabelText('Dry run');
    expect(dryRunCheckbox).not.toBeChecked();

    await user.click(dryRunCheckbox);
    expect(dryRunCheckbox).toBeChecked();
  });

  it('renders back button pointing to Exports', () => {
    render(<ExportsCreator />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/exports/create'] },
    });

    expect(screen.getByText('Exports')).toBeInTheDocument();
  });
});
