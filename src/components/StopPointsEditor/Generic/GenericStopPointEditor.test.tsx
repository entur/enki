import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import { GenericStopPointEditor } from './GenericStopPointEditor';
import { createQuayStopPoint, createFirstStopPoint } from 'test/factories';

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
  useSelectedBoardingType: (sp: any) => {
    if (sp.forBoarding && sp.forAlighting) return '2';
    if (sp.forBoarding) return '0';
    if (sp.forAlighting) return '1';
    return undefined;
  },
  useOnBoardingTypeChange: () => vi.fn(),
}));

vi.mock('@entur/react-component-toggle', () => ({
  ComponentToggle: ({ renderFallback }: any) =>
    renderFallback ? renderFallback() : null,
}));

vi.mock('../common/DeleteStopPointDialog', () => ({
  DeleteStopPointDialog: ({ isOpen }: any) =>
    isOpen ? <div data-testid="delete-dialog">Delete dialog</div> : null,
}));

describe('GenericStopPointEditor', () => {
  const defaultProps = {
    order: 1,
    stopPoint: createQuayStopPoint('NSR:Quay:1'),
    spoilPristine: false,
    isFirst: true,
    isLast: false,
    onChange: vi.fn(),
    onDelete: vi.fn(),
    canDelete: true,
    flexibleLineType: undefined,
    onFocusedQuayIdUpdate: vi.fn(),
    swapStopPoints: vi.fn(),
    stopPlacesInJourneyPattern: [],
    updateStopPlacesInJourneyPattern: vi.fn(),
  };

  it('renders the quay ref field', () => {
    render(<GenericStopPointEditor {...defaultProps} />);
    expect(screen.getByTestId('quay-ref-field')).toBeInTheDocument();
  });

  it('renders the front text field', () => {
    render(<GenericStopPointEditor {...defaultProps} />);
    expect(screen.getByTestId('front-text-field')).toBeInTheDocument();
  });

  it('renders the boarding type select', () => {
    render(<GenericStopPointEditor {...defaultProps} />);
    expect(screen.getByTestId('boarding-type-select')).toBeInTheDocument();
  });

  it('renders delete button', () => {
    render(<GenericStopPointEditor {...defaultProps} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('disables delete button when canDelete is false', () => {
    render(<GenericStopPointEditor {...defaultProps} canDelete={false} />);
    const deleteBtn = screen.getByText('Delete').closest('button');
    expect(deleteBtn).toBeDisabled();
  });

  it('displays the stop point order number', () => {
    render(<GenericStopPointEditor {...defaultProps} order={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('passes quayRef to QuayRefField', () => {
    render(<GenericStopPointEditor {...defaultProps} />);
    expect(screen.getByTestId('quay-ref-field').textContent).toContain(
      'NSR:Quay:1',
    );
  });

  it('passes frontText to FrontTextTextField', () => {
    const stopPoint = createFirstStopPoint('NSR:Quay:1', {
      destinationDisplay: { frontText: 'Terminus' },
    });
    render(<GenericStopPointEditor {...defaultProps} stopPoint={stopPoint} />);
    expect(screen.getByTestId('front-text-field').textContent).toContain(
      'Terminus',
    );
  });
});
