import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
import MenuDrawer from './index';
import { isActive } from './index';
import { mockProviders } from 'mocks/mockData';

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { profile: { name: 'Test User' } },
    logout: vi.fn(),
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
  }),
  hasAuthParams: () => false,
}));

vi.mock('@entur/react-component-toggle', () => ({
  ComponentToggle: () => null,
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

describe('isActive', () => {
  it('returns true when first path segment matches', () => {
    expect(isActive('/lines/123', '/lines')).toBe(true);
  });

  it('returns false when first path segment differs', () => {
    expect(isActive('/lines/123', '/exports')).toBe(false);
  });

  it('returns true for exact top-level match', () => {
    expect(isActive('/exports', '/exports')).toBe(true);
  });

  it('returns true for nested paths with same root', () => {
    expect(isActive('/flexible-lines/edit/1', '/flexible-lines')).toBe(true);
  });

  it('returns false for root path vs named path', () => {
    expect(isActive('/', '/lines')).toBe(false);
  });
});

describe('MenuDrawer', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders navigation items when drawer is open and provider is active', () => {
    render(<MenuDrawer open={true} onClose={onClose} />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    expect(screen.getByText('Lines')).toBeInTheDocument();
    expect(screen.getByText('Networks')).toBeInTheDocument();
    expect(screen.getByText('Brandings')).toBeInTheDocument();
    expect(screen.getByText('Day Types')).toBeInTheDocument();
    expect(screen.getByText('Exports')).toBeInTheDocument();
  });

  it('renders flexible offers section with sub-items', () => {
    render(<MenuDrawer open={true} onClose={onClose} />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    expect(screen.getByText('Flexible offers')).toBeInTheDocument();
    expect(screen.getByText('Flexible lines')).toBeInTheDocument();
    expect(screen.getByText('Flexible stop places')).toBeInTheDocument();
  });

  it('does not render nav items when no active provider', () => {
    render(<MenuDrawer open={true} onClose={onClose} />, {
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

    expect(screen.queryByText('Lines')).not.toBeInTheDocument();
    expect(screen.queryByText('Exports')).not.toBeInTheDocument();
  });

  it('renders Providers link when user is admin', () => {
    render(<MenuDrawer open={true} onClose={onClose} />, {
      preloadedState: {
        ...defaultState,
        userContext: { ...defaultState.userContext, isAdmin: true as const },
      },
      routerProps: { initialEntries: ['/lines'] },
    });

    expect(screen.getByText('Providers')).toBeInTheDocument();
  });

  it('does not render Providers link when user is not admin', () => {
    render(<MenuDrawer open={true} onClose={onClose} />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    expect(screen.queryByText('Providers')).not.toBeInTheDocument();
  });

  it('renders the app title in drawer header', () => {
    render(<MenuDrawer open={true} onClose={onClose} />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    expect(screen.getByText('Nplan')).toBeInTheDocument();
  });

  it('collapses flexible offers section when clicking header', async () => {
    const user = userEvent.setup();
    render(<MenuDrawer open={true} onClose={onClose} />, {
      preloadedState: defaultState,
      routerProps: { initialEntries: ['/lines'] },
    });

    // Initially flexible sub-items are visible
    expect(screen.getByText('Flexible lines')).toBeInTheDocument();

    // Click to collapse
    await user.click(screen.getByText('Flexible offers'));

    // After collapse, items should be hidden (unmountOnExit)
    expect(screen.queryByText('Flexible lines')).not.toBeInTheDocument();
  });
});
