import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import BookingArrangementEditor from './editor';
import { BookingInfoAttachmentType } from './constants';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const renderEditor = (props = {}) => {
  const defaultProps = {
    onChange: vi.fn(),
    bookingArrangement: {},
    spoilPristine: false,
    bookingInfoAttachment: {
      type: BookingInfoAttachmentType.LINE,
      name: 'Test Line',
    },
  };
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BookingArrangementEditor {...defaultProps} {...props} />
    </LocalizationProvider>,
  );
};

describe('BookingArrangementEditor', () => {
  it('renders all contact fields', () => {
    renderEditor();
    expect(screen.getByLabelText('Contact person')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Booking note')).toBeInTheDocument();
    expect(screen.getByLabelText('Further details')).toBeInTheDocument();
  });

  it('renders booking info text', () => {
    renderEditor();
    expect(
      screen.getByText('Information about how the service can be booked.'),
    ).toBeInTheDocument();
  });

  it('renders attachment type label and name', () => {
    renderEditor();
    expect(screen.getByDisplayValue('Test Line')).toBeInTheDocument();
  });

  it('calls onChange when contact person is typed', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    const contactInput = screen.getByLabelText('Contact person');
    await userEvent.type(contactInput, 'J');
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.bookingContact.contactPerson).toBe('J');
  });

  it('calls onChange when booking note is typed', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    const noteInput = screen.getByLabelText('Booking note');
    await userEvent.type(noteInput, 'Call ahead');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders booking limit radio buttons', () => {
    renderEditor();
    expect(screen.getByLabelText('None')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Latest possible booking time'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'The minimum period prior to the departure the booking has to be placed',
      ),
    ).toBeInTheDocument();
  });

  it('renders booking method chips', () => {
    renderEditor();
    expect(screen.getByText('Call driver')).toBeInTheDocument();
    expect(screen.getByText('Call office')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('Phone at stop')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('renders payment chips', () => {
    renderEditor();
    expect(screen.getByText('After boarding')).toBeInTheDocument();
    expect(screen.getByText('Before boarding')).toBeInTheDocument();
    expect(screen.getByText('On checkout')).toBeInTheDocument();
    expect(screen.getByText('On reservation')).toBeInTheDocument();
  });

  it('calls onChange when a booking method chip is clicked', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    await userEvent.click(screen.getByText('Online'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingMethods: ['online'],
      }),
    );
  });

  it('renders with pre-filled booking arrangement', () => {
    renderEditor({
      bookingArrangement: {
        bookingContact: {
          contactPerson: 'Jane',
          email: 'jane@example.com',
          phone: '12345',
          url: 'https://example.com',
        },
        bookingNote: 'Please book ahead',
      },
    });
    expect(screen.getByLabelText('Contact person')).toHaveValue('Jane');
    expect(screen.getByLabelText('E-mail')).toHaveValue('jane@example.com');
    expect(screen.getByLabelText('Phone')).toHaveValue('12345');
    expect(screen.getByLabelText('URL')).toHaveValue('https://example.com');
    expect(screen.getByLabelText('Booking note')).toHaveValue(
      'Please book ahead',
    );
  });
});
