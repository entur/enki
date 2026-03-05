import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import { GenericStopPointsEditor } from './GenericStopPointsEditor';
import { createStopPointSequence } from 'test/factories';

// Mock useAuth
vi.mock('../../../auth/auth', () => ({
  useAuth: () => ({
    isLoading: false,
    isAuthenticated: true,
    getAccessToken: () => Promise.resolve('fake-token'),
    logout: vi.fn(),
    login: vi.fn(),
  }),
}));

// Mock UttuQuery
vi.mock('../../../api', () => ({
  UttuQuery: vi.fn(() => Promise.resolve({ stopPlaces: [] })),
  StopPlace: {},
}));

vi.mock('../../../api/uttu/queries', () => ({
  getStopPlacesQuery: 'mock-query',
}));

// Mock the individual stop point editor to simplify
vi.mock('./GenericStopPointEditor', () => ({
  GenericStopPointEditor: ({ order, stopPoint }: any) => (
    <div data-testid={`stop-point-${order}`}>
      Stop {order}: {stopPoint.quayRef}
    </div>
  ),
}));

// Mock ComponentToggle to render nothing (map feature off)
vi.mock('@entur/react-component-toggle', () => ({
  ComponentToggle: () => null,
}));

describe('GenericStopPointsEditor', () => {
  const stopPoints = createStopPointSequence(3);
  const defaultProps = {
    pointsInSequence: stopPoints,
    spoilPristine: false,
    updateStopPoint: vi.fn(),
    deleteStopPoint: vi.fn(),
    addStopPoint: vi.fn(),
    flexibleLineType: undefined,
    transportMode: undefined,
    onPointsInSequenceChange: vi.fn(),
    initDefaultJourneyPattern: vi.fn(),
    swapStopPoints: vi.fn(),
  };

  it('renders the section heading', async () => {
    render(<GenericStopPointsEditor {...defaultProps} />, {
      config: { uttuApiUrl: 'http://test' },
      preloadedState: {
        userContext: { activeProviderCode: 'TST' } as any,
      },
    });
    expect(
      screen.getByText('Add stop points defining the service'),
    ).toBeInTheDocument();
  });

  it('renders info text when map is not enabled', async () => {
    render(<GenericStopPointsEditor {...defaultProps} />, {
      config: { uttuApiUrl: 'http://test' },
      preloadedState: {
        userContext: { activeProviderCode: 'TST' } as any,
      },
    });
    expect(
      screen.getByText(/You have to add at least two stop points/),
    ).toBeInTheDocument();
  });

  it('calls initDefaultJourneyPattern when pointsInSequence is empty', () => {
    render(
      <GenericStopPointsEditor {...defaultProps} pointsInSequence={[]} />,
      {
        config: { uttuApiUrl: 'http://test' },
        preloadedState: {
          userContext: { activeProviderCode: 'TST' } as any,
        },
      },
    );
    expect(defaultProps.initDefaultJourneyPattern).toHaveBeenCalled();
  });

  it('does not call initDefaultJourneyPattern when stop points exist', () => {
    const initFn = vi.fn();
    render(
      <GenericStopPointsEditor
        {...defaultProps}
        initDefaultJourneyPattern={initFn}
      />,
      {
        config: { uttuApiUrl: 'http://test' },
        preloadedState: {
          userContext: { activeProviderCode: 'TST' } as any,
        },
      },
    );
    expect(initFn).not.toHaveBeenCalled();
  });

  it('renders an add stop point button', async () => {
    render(<GenericStopPointsEditor {...defaultProps} />, {
      config: { uttuApiUrl: 'http://test' },
      preloadedState: {
        userContext: { activeProviderCode: 'TST' } as any,
      },
    });
    expect(screen.getByText('Add stop point')).toBeInTheDocument();
  });
});
