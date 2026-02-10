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

describe('BookingArrangementEditor - branch coverage', () => {
  it('switches booking limit type to TIME and clears fields', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    const timeRadio = screen.getByLabelText('Latest possible booking time');
    await userEvent.click(timeRadio);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        latestBookingTime: undefined,
        minimumBookingPeriod: undefined,
      }),
    );
  });

  it('switches booking limit type to PERIOD and clears bookWhen', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    const periodRadio = screen.getByLabelText(
      'The minimum period prior to the departure the booking has to be placed',
    );
    await userEvent.click(periodRadio);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        latestBookingTime: undefined,
        minimumBookingPeriod: undefined,
        bookWhen: undefined,
      }),
    );
  });

  it('toggles a payment chip on', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    await userEvent.click(screen.getByText('After boarding'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        buyWhen: ['afterBoarding'],
      }),
    );
  });

  it('toggles a payment chip off when already selected', async () => {
    const onChange = vi.fn();
    renderEditor({
      onChange,
      bookingArrangement: { buyWhen: ['afterBoarding'] },
    });
    await userEvent.click(screen.getByText('After boarding'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        buyWhen: [],
      }),
    );
  });

  it('removes a booking method chip when already selected', async () => {
    const onChange = vi.fn();
    renderEditor({
      onChange,
      bookingArrangement: { bookingMethods: ['online'] },
    });
    await userEvent.click(screen.getByText('Online'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingMethods: [],
      }),
    );
  });

  it('renders with pre-filled latestBookingTime and selects TIME radio', () => {
    renderEditor({
      bookingArrangement: { latestBookingTime: '14:30' },
    });
    const timeRadio = screen.getByLabelText('Latest possible booking time');
    expect(timeRadio).toBeChecked();
    const noneRadio = screen.getByLabelText('None');
    expect(noneRadio).not.toBeChecked();
  });

  it('hides attachment field when bookingInfoAttachment name is empty', () => {
    renderEditor({
      bookingInfoAttachment: {
        type: BookingInfoAttachmentType.LINE,
        name: '',
      },
    });
    expect(screen.queryByLabelText('Line')).not.toBeInTheDocument();
  });

  it('renders with minimumBookingPeriod and selects PERIOD radio', () => {
    renderEditor({
      bookingArrangement: { minimumBookingPeriod: 'PT2H' },
    });
    const periodRadio = screen.getByLabelText(
      'The minimum period prior to the departure the booking has to be placed',
    );
    expect(periodRadio).toBeChecked();
  });

  it('renders STOP_POINT attachment label', () => {
    renderEditor({
      bookingInfoAttachment: {
        type: BookingInfoAttachmentType.STOP_POINT_IN_JOURNEYPATTERN,
        name: 'Stop A',
      },
    });
    expect(screen.getByDisplayValue('Stop A')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Stop Point in Journey Pattern'),
    ).toBeInTheDocument();
  });

  it('renders SERVICE_JOURNEY attachment label', () => {
    renderEditor({
      bookingInfoAttachment: {
        type: BookingInfoAttachmentType.SERVICE_JOURNEY,
        name: 'SJ-1',
      },
    });
    expect(screen.getByDisplayValue('SJ-1')).toBeInTheDocument();
    expect(screen.getByLabelText('Service Journey')).toBeInTheDocument();
  });

  it('calls onChange when email is typed', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    const emailInput = screen.getByLabelText('E-mail');
    await userEvent.type(emailInput, 'a');
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.bookingContact.email).toBe('a');
  });

  it('calls onChange when phone is typed', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    const phoneInput = screen.getByLabelText('Phone');
    await userEvent.type(phoneInput, '1');
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.bookingContact.phone).toBe('1');
  });

  it('calls onChange when URL is typed', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    const urlInput = screen.getByLabelText('URL');
    await userEvent.type(urlInput, 'x');
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.bookingContact.url).toBe('x');
  });

  it('calls onChange when further details is typed', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    const detailsInput = screen.getByLabelText('Further details');
    await userEvent.type(detailsInput, 'z');
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.bookingContact.furtherDetails).toBe('z');
  });
});
