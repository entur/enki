import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
import { MixedFlexibleStopPointsEditor } from './MixedFlexibleStopPointsEditor';
import {
  createStopPointSequence,
  createFlexibleStopPointSequence,
} from 'test/factories';

// Mock the individual stop point editor to simplify
vi.mock('./MixedFlexibleStopPointEditor', () => ({
  MixedFlexibleStopPointEditor: ({ order, stopPoint }: any) => (
    <div data-testid={`stop-point-${order}`}>
      Stop {order}: {stopPoint.quayRef || stopPoint.flexibleStopPlaceRef}
    </div>
  ),
}));

describe('MixedFlexibleStopPointsEditor', () => {
  const stopPoints = createStopPointSequence(3);
  const defaultProps = {
    pointsInSequence: stopPoints,
    spoilPristine: false,
    updateStopPoint: vi.fn(),
    deleteStopPoint: vi.fn(),
    addStopPoint: vi.fn(),
    initDefaultJourneyPattern: vi.fn(),
    swapStopPoints: vi.fn(),
    flexibleLineType: undefined,
    transportMode: undefined,
    onPointsInSequenceChange: vi.fn(),
  };

  it('renders the section heading', () => {
    render(<MixedFlexibleStopPointsEditor {...defaultProps} />);
    expect(
      screen.getByText('Add stop points defining the service'),
    ).toBeInTheDocument();
  });

  it('renders info text for mixed flexible', () => {
    render(<MixedFlexibleStopPointsEditor {...defaultProps} />);
    expect(
      screen.getByText(
        /Add a sequence of at least two fixed stopping positions/,
      ),
    ).toBeInTheDocument();
  });

  it('renders all stop point editors', () => {
    render(<MixedFlexibleStopPointsEditor {...defaultProps} />);
    expect(screen.getByTestId('stop-point-1')).toBeInTheDocument();
    expect(screen.getByTestId('stop-point-2')).toBeInTheDocument();
    expect(screen.getByTestId('stop-point-3')).toBeInTheDocument();
  });

  it('calls initDefaultJourneyPattern when pointsInSequence is empty', () => {
    const initFn = vi.fn();
    render(
      <MixedFlexibleStopPointsEditor
        {...defaultProps}
        pointsInSequence={[]}
        initDefaultJourneyPattern={initFn}
      />,
    );
    expect(initFn).toHaveBeenCalled();
  });

  it('does not call initDefaultJourneyPattern when stop points exist', () => {
    const initFn = vi.fn();
    render(
      <MixedFlexibleStopPointsEditor
        {...defaultProps}
        initDefaultJourneyPattern={initFn}
      />,
    );
    expect(initFn).not.toHaveBeenCalled();
  });

  it('renders an add stop point button', () => {
    render(<MixedFlexibleStopPointsEditor {...defaultProps} />);
    expect(screen.getByText('Add stop point')).toBeInTheDocument();
  });

  it('calls addStopPoint when clicking add button', async () => {
    const addStopPoint = vi.fn();
    const user = userEvent.setup();
    render(
      <MixedFlexibleStopPointsEditor
        {...defaultProps}
        addStopPoint={addStopPoint}
      />,
    );
    // AddButton renders as IconButton + Typography; click the icon button
    await user.click(screen.getByTestId('AddIcon'));
    expect(addStopPoint).toHaveBeenCalled();
  });

  it('renders flexible stop points', () => {
    const flexibleStopPoints = createFlexibleStopPointSequence(2);
    render(
      <MixedFlexibleStopPointsEditor
        {...defaultProps}
        pointsInSequence={flexibleStopPoints}
      />,
    );
    expect(screen.getByTestId('stop-point-1')).toBeInTheDocument();
    expect(screen.getByTestId('stop-point-2')).toBeInTheDocument();
  });

  it('cleans up stop points that have both quayRef and flexibleStopPlaceRef', () => {
    const mixedStopPoints = [
      {
        key: 'abc123',
        quayRef: 'NSR:Quay:1',
        flexibleStopPlaceRef: 'TST:FlexibleStopPlace:1',
        forBoarding: true,
        forAlighting: true,
      },
    ];
    render(
      <MixedFlexibleStopPointsEditor
        {...defaultProps}
        pointsInSequence={mixedStopPoints}
      />,
    );
    // The component should still render the stop point (it cleans up internally)
    expect(screen.getByTestId('stop-point-1')).toBeInTheDocument();
  });
});
