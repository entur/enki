import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, userEvent } from 'utils/test-utils';
import { MixedFlexibleStopPointEditor } from './MixedFlexibleStopPointEditor';
import { createFirstStopPoint } from 'test/factories';
import StopPoint from 'model/StopPoint';

// Mock complex child components to focus on the editor's own logic
vi.mock('../common/QuayRefField', () => ({
  QuayRefField: ({ initialQuayRef }: any) => (
    <div data-testid="quay-ref-field">{initialQuayRef}</div>
  ),
  useOnQuayRefChange: () => vi.fn(),
}));

vi.mock('../common/FrontTextTextField', () => ({
  FrontTextTextField: ({ value, disabled }: any) => (
    <div data-testid="front-text-field" data-disabled={disabled}>
      {value}
    </div>
  ),
  useOnFrontTextChange: () => vi.fn(),
}));

vi.mock('../common/BoardingTypeSelect', () => ({
  BoardingTypeSelect: ({ boardingType }: any) => (
    <div data-testid="boarding-type-select">{boardingType}</div>
  ),
  useSelectedBoardingType: () => 'both',
  useOnBoardingTypeChange: () => vi.fn(),
}));

vi.mock('../common/FlexibleStopPlaceSelector', () => ({
  FlexibleStopPlaceSelector: () => (
    <div data-testid="flexible-stop-place-selector">Flexible selector</div>
  ),
}));

vi.mock('../common/DeleteStopPointDialog', () => ({
  DeleteStopPointDialog: ({ isOpen }: any) =>
    isOpen ? <div data-testid="delete-dialog">Delete dialog</div> : null,
}));

vi.mock('../common/StopPointBookingArrangement', () => ({
  StopPointBookingArrangement: () => (
    <div data-testid="booking-arrangement">Booking</div>
  ),
}));

/**
 * Create a stop point in external (quayRef) mode.
 * Only includes keys relevant for external mode, no flexibleStopPlaceRef key.
 */
const createExternalStopPoint = (quayRef = 'NSR:Quay:1'): StopPoint => ({
  key: 'abc123def456',
  quayRef,
  destinationDisplay: { frontText: 'City Center' },
  forBoarding: true,
  forAlighting: true,
});

/**
 * Create a stop point in flexible mode.
 * Only includes flexibleStopPlaceRef key, no quayRef key.
 */
const createFlexibleModeStopPoint = (): StopPoint => ({
  key: 'flex123abc456',
  flexibleStopPlaceRef: 'TST:FlexibleStopPlace:1',
  destinationDisplay: null,
  forBoarding: true,
  forAlighting: true,
});

describe('MixedFlexibleStopPointEditor', () => {
  const defaultProps = {
    order: 1,
    stopPoint: createExternalStopPoint(),
    spoilPristine: false,
    isFirst: true,
    isLast: false,
    onChange: vi.fn(),
    onDelete: vi.fn(),
    canDelete: true,
    swapStopPoints: vi.fn(),
  };

  it('renders the stop point order number', () => {
    render(<MixedFlexibleStopPointEditor {...defaultProps} order={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders radio buttons for flexible and external mode', () => {
    render(<MixedFlexibleStopPointEditor {...defaultProps} />);
    expect(screen.getByLabelText('Flexible stop place')).toBeInTheDocument();
    expect(screen.getByLabelText('Stop place')).toBeInTheDocument();
  });

  it('shows QuayRefField when stop point has quayRef (external mode)', () => {
    render(<MixedFlexibleStopPointEditor {...defaultProps} />);
    expect(screen.getByTestId('quay-ref-field')).toBeInTheDocument();
    expect(
      screen.queryByTestId('flexible-stop-place-selector'),
    ).not.toBeInTheDocument();
  });

  it('shows FlexibleStopPlaceSelector when stop point is flexible', () => {
    render(
      <MixedFlexibleStopPointEditor
        {...defaultProps}
        stopPoint={createFlexibleModeStopPoint()}
      />,
    );
    expect(
      screen.getByTestId('flexible-stop-place-selector'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('quay-ref-field')).not.toBeInTheDocument();
  });

  it('renders the front text field', () => {
    render(<MixedFlexibleStopPointEditor {...defaultProps} />);
    expect(screen.getByTestId('front-text-field')).toBeInTheDocument();
  });

  it('renders the boarding type select', () => {
    render(<MixedFlexibleStopPointEditor {...defaultProps} />);
    expect(screen.getByTestId('boarding-type-select')).toBeInTheDocument();
  });

  it('renders delete button', () => {
    render(<MixedFlexibleStopPointEditor {...defaultProps} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('disables delete button when canDelete is false', () => {
    render(
      <MixedFlexibleStopPointEditor {...defaultProps} canDelete={false} />,
    );
    const deleteBtn = screen.getByText('Delete').closest('button');
    expect(deleteBtn).toBeDisabled();
  });

  it('renders booking arrangement section', () => {
    render(<MixedFlexibleStopPointEditor {...defaultProps} />);
    expect(screen.getByTestId('booking-arrangement')).toBeInTheDocument();
  });

  it('switches to flexible mode when clicking the flexible radio', () => {
    const onChange = vi.fn();

    render(
      <MixedFlexibleStopPointEditor {...defaultProps} onChange={onChange} />,
    );

    // The stop point starts in external mode (has quayRef).
    // Click the flexible radio to switch.
    const flexibleRadio = screen.getByLabelText('Flexible stop place');
    fireEvent.click(flexibleRadio);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        flexibleStopPlaceRef: null,
      }),
    );
  });

  it('switches to external mode when clicking the external radio', () => {
    const onChange = vi.fn();

    render(
      <MixedFlexibleStopPointEditor
        {...defaultProps}
        stopPoint={createFlexibleModeStopPoint()}
        onChange={onChange}
      />,
    );

    // The stop point starts in flexible mode (has flexibleStopPlaceRef, no quayRef).
    // Click the external radio to switch.
    const externalRadio = screen.getByLabelText('Stop place');
    fireEvent.click(externalRadio);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        quayRef: null,
      }),
    );
    // The onChange call should not include flexibleStopPlaceRef
    const calledArg = onChange.mock.calls[0][0];
    expect(calledArg).not.toHaveProperty('flexibleStopPlaceRef');
    expect(calledArg).not.toHaveProperty('flexibleStopPlace');
  });

  it('opens delete dialog when clicking delete button', async () => {
    const user = userEvent.setup();

    render(<MixedFlexibleStopPointEditor {...defaultProps} />);

    expect(screen.queryByTestId('delete-dialog')).not.toBeInTheDocument();

    const deleteBtn = screen.getByText('Delete').closest('button')!;
    await user.click(deleteBtn);

    expect(screen.getByTestId('delete-dialog')).toBeInTheDocument();
  });

  it('passes frontText to FrontTextTextField', () => {
    const stopPoint = createFirstStopPoint('NSR:Quay:1', {
      destinationDisplay: { frontText: 'Terminus' },
    });
    render(
      <MixedFlexibleStopPointEditor {...defaultProps} stopPoint={stopPoint} />,
    );
    expect(screen.getByTestId('front-text-field').textContent).toContain(
      'Terminus',
    );
  });
});
