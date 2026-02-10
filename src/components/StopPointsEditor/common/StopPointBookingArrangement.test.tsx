import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import { StopPointBookingArrangement } from './StopPointBookingArrangement';
import { createFlexibleStopPoint, createQuayStopPoint } from 'test/factories';

describe('StopPointBookingArrangement', () => {
  it('renders with flexible stop place name', () => {
    const stopPoint = createFlexibleStopPoint();
    render(
      <StopPointBookingArrangement
        stopPoint={stopPoint}
        spoilPristine={false}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Booking information')).toBeInTheDocument();
  });

  it('renders with quay ref fallback when no flexible stop place', () => {
    const stopPoint = createQuayStopPoint('NSR:Quay:1');
    stopPoint.flexibleStopPlace = undefined;
    stopPoint.bookingArrangement = null;
    render(
      <StopPointBookingArrangement
        stopPoint={stopPoint}
        spoilPristine={false}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Booking information')).toBeInTheDocument();
  });

  it('shows edit and remove buttons when bookingArrangement exists', () => {
    const stopPoint = createFlexibleStopPoint();
    render(
      <StopPointBookingArrangement
        stopPoint={stopPoint}
        spoilPristine={false}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Show / Edit')).toBeInTheDocument();
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('shows add button when no bookingArrangement', () => {
    const stopPoint = createFlexibleStopPoint({
      bookingArrangement: null,
    });
    render(
      <StopPointBookingArrangement
        stopPoint={stopPoint}
        spoilPristine={false}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('calls onChange with null bookingArrangement on remove', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const onChange = vi.fn();
    const stopPoint = createFlexibleStopPoint();
    render(
      <StopPointBookingArrangement
        stopPoint={stopPoint}
        spoilPristine={false}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByText('Remove'));
    expect(onChange).toHaveBeenCalledWith({
      ...stopPoint,
      bookingArrangement: null,
    });
  });
});
