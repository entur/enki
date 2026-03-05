import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHookWithProviders, waitFor } from 'utils/test-utils';
import { useLoadDependencies } from './hooks';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ id: 'TST:FlexibleLine:101' }),
    useNavigate: () => mockNavigate,
  };
});

const mockLoadNetworks = vi.fn(() => () => Promise.resolve());
const mockLoadBrandings = vi.fn(() => () => Promise.resolve());
const mockLoadFlexibleLineById = vi.fn(
  (..._args: any[]) =>
    () =>
      Promise.resolve(),
);
const mockLoadFlexibleStopPlaces = vi.fn(() => () => Promise.resolve());

vi.mock('actions/networks', () => ({
  loadNetworks: (...args: unknown[]) => mockLoadNetworks(),
}));

vi.mock('../../actions/brandings', () => ({
  loadBrandings: (...args: unknown[]) => mockLoadBrandings(),
}));

vi.mock('actions/flexibleLines', () => ({
  loadFlexibleLineById: (...args: any[]) => mockLoadFlexibleLineById(...args),
}));

vi.mock('actions/flexibleStopPlaces', () => ({
  loadFlexibleStopPlaces: (...args: unknown[]) => mockLoadFlexibleStopPlaces(),
}));

describe('useLoadDependencies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadNetworks.mockReturnValue(() => Promise.resolve());
    mockLoadBrandings.mockReturnValue(() => Promise.resolve());
    mockLoadFlexibleLineById.mockReturnValue(() => Promise.resolve());
    mockLoadFlexibleStopPlaces.mockReturnValue(() => Promise.resolve());
  });

  it('starts with isLoadingDependencies true', () => {
    const { result } = renderHookWithProviders(() => useLoadDependencies(), {
      routerProps: { initialEntries: ['/flexible-lines/TST:FlexibleLine:101'] },
    });
    // Initially loading
    expect(result.current.isLoadingDependencies).toBe(true);
  });

  it('dispatches all four load actions on mount', async () => {
    renderHookWithProviders(() => useLoadDependencies(), {
      routerProps: { initialEntries: ['/flexible-lines/TST:FlexibleLine:101'] },
    });

    await waitFor(() => {
      expect(mockLoadNetworks).toHaveBeenCalled();
      expect(mockLoadBrandings).toHaveBeenCalled();
      expect(mockLoadFlexibleLineById).toHaveBeenCalled();
      expect(mockLoadFlexibleStopPlaces).toHaveBeenCalled();
    });
  });

  it('resolves isLoadingDependencies to false when all loads complete', async () => {
    const { result } = renderHookWithProviders(() => useLoadDependencies(), {
      routerProps: { initialEntries: ['/flexible-lines/TST:FlexibleLine:101'] },
    });

    await waitFor(() => {
      expect(result.current.isLoadingDependencies).toBe(false);
    });
  });

  it('returns a refetchFlexibleLine callback', async () => {
    const { result } = renderHookWithProviders(() => useLoadDependencies(), {
      routerProps: { initialEntries: ['/flexible-lines/TST:FlexibleLine:101'] },
    });

    await waitFor(() => {
      expect(result.current.isLoadingDependencies).toBe(false);
    });
    expect(typeof result.current.refetchFlexibleLine).toBe('function');
  });

  it('detects FlexibleLine type from the id param', async () => {
    renderHookWithProviders(() => useLoadDependencies(), {
      routerProps: { initialEntries: ['/flexible-lines/TST:FlexibleLine:101'] },
    });

    await waitFor(() => {
      expect(mockLoadFlexibleLineById).toHaveBeenCalledWith(
        'TST:FlexibleLine:101',
        true,
        expect.anything(),
      );
    });
  });
});
