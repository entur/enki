import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
import Header from './index';
import { mockProviders } from 'mocks/mockData';

const mockSignoutRedirect = vi.fn().mockResolvedValue(undefined);

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { profile: { name: 'Test User' }, access_token: 'fake-token' },
    logout: vi.fn(),
    signinRedirect: vi.fn(),
    signoutRedirect: mockSignoutRedirect,
  }),
  hasAuthParams: () => false,
}));

vi.mock('@entur/react-component-toggle', () => ({
  ComponentToggle: ({ renderFallback }: { renderFallback: () => any }) =>
    renderFallback(),
}));

const defaultState = {
  userContext: {
    providers: mockProviders,
    activeProviderCode: 'TST',
    isAdmin: false,
    preferredName: 'Test User',
    loaded: true,
  },
  editor: { isSaved: true },
} as const;

describe('Header', () => {
  it('renders the app title (logo fallback)', () => {
    render(<Header />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    expect(screen.getAllByText('Nplan').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the hamburger menu button', () => {
    render(<Header />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    expect(screen.getByLabelText('Nplan')).toBeInTheDocument();
  });

  it('renders user icon button with preferred name as label', () => {
    render(<Header />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    expect(screen.getByLabelText('Test User')).toBeInTheDocument();
  });

  it('shows user popover with name and logout button on click', async () => {
    const user = userEvent.setup();
    render(<Header />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    await user.click(screen.getByLabelText('Test User'));

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('does not render provider selector when no provider selected', () => {
    render(<Header />, {
      preloadedState: {
        ...defaultState,
        userContext: {
          ...defaultState.userContext,
          activeProviderCode: undefined,
          loaded: true,
        },
      },
      routerProps: { initialEntries: ['/'] },
    });

    expect(
      screen.queryByLabelText('Choose data provider'),
    ).not.toBeInTheDocument();
  });

  it('renders provider selector when provider is active and providers exist', () => {
    render(<Header />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    expect(screen.getByLabelText('Choose data provider')).toBeInTheDocument();
  });

  it('shows "Unknown" when preferredName is not set', () => {
    const user = userEvent.setup();
    const { getByLabelText } = render(<Header />, {
      preloadedState: {
        ...defaultState,
        userContext: {
          ...defaultState.userContext,
          preferredName: undefined as unknown as string,
          loaded: true,
        },
      },
      routerProps: { initialEntries: ['/lines'] },
    });

    // The user icon button should have label "User" when no preferredName
    expect(getByLabelText('User')).toBeInTheDocument();
  });

  it('shows "Unknown" in popover when preferredName is not set', async () => {
    const user = userEvent.setup();
    render(<Header />, {
      preloadedState: {
        ...defaultState,
        userContext: {
          ...defaultState.userContext,
          preferredName: undefined as unknown as string,
          loaded: true,
        },
      },
      routerProps: { initialEntries: ['/lines'] },
    });

    await user.click(screen.getByLabelText('User'));

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('calls logout when log out button is clicked', async () => {
    const user = userEvent.setup();
    mockSignoutRedirect.mockClear();
    render(<Header />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    await user.click(screen.getByLabelText('Test User'));
    await user.click(screen.getByText('Log out'));

    expect(mockSignoutRedirect).toHaveBeenCalled();
  });

  it('opens drawer when hamburger menu is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    await user.click(screen.getByLabelText('Nplan'));

    expect(screen.getByText('Lines')).toBeInTheDocument();
  });

  it('does not render provider selector when providers array is empty', () => {
    render(<Header />, {
      preloadedState: {
        ...defaultState,
        userContext: {
          ...defaultState.userContext,
          providers: [],
          loaded: true,
        },
      },
      routerProps: { initialEntries: ['/lines'] },
    });

    expect(
      screen.queryByLabelText('Choose data provider'),
    ).not.toBeInTheDocument();
  });
});
