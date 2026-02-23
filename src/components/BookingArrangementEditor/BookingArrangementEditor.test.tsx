import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import BookingArrangementEditor from './index';
import { BookingInfoAttachmentType } from './constants';
import { createBookingArrangement } from 'test/factories';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const renderEditor = (props = {}) => {
  const defaultProps = {
    bookingArrangement: null as any,
    bookingInfoAttachment: {
      type: BookingInfoAttachmentType.LINE,
      name: 'Test Line',
    },
    onChange: vi.fn(),
    onRemove: vi.fn(),
    spoilPristine: false,
    ...props,
  };

  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BookingArrangementEditor {...defaultProps} />
    </LocalizationProvider>,
  );
};

describe('BookingArrangementEditor (wrapper)', () => {
  it('renders the booking info header', () => {
    renderEditor();
    expect(screen.getByText('Booking information')).toBeInTheDocument();
  });

  it('renders help text when trim is false (default)', () => {
    renderEditor();
    expect(
      screen.getByText(/Booking information can be added/),
    ).toBeInTheDocument();
  });

  it('does not render help text when trim is true', () => {
    renderEditor({ trim: true });
    expect(
      screen.queryByText(/Booking information can be added/),
    ).not.toBeInTheDocument();
  });

  it('renders Add button when no booking arrangement exists', () => {
    renderEditor({ bookingArrangement: null });
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('renders Show/Edit and Remove buttons when booking arrangement exists', () => {
    renderEditor({ bookingArrangement: createBookingArrangement() });
    expect(
      screen.getByRole('button', { name: 'Show / Edit' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('calls onRemove when Remove button is clicked', async () => {
    const onRemove = vi.fn();
    renderEditor({
      bookingArrangement: createBookingArrangement(),
      onRemove,
    });
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('opens dialog when Add button is clicked', async () => {
    renderEditor({ bookingArrangement: null });
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('opens dialog when Show/Edit button is clicked', async () => {
    renderEditor({ bookingArrangement: createBookingArrangement() });
    await userEvent.click(screen.getByRole('button', { name: 'Show / Edit' }));
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});
