import * as duration from 'duration-fns';
import { copyServiceJourney } from './CopyDialog';
import { describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  userEvent,
  createServiceJourney,
} from 'utils/test-utils';
import CopyDialog from './CopyDialog';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

describe('copyServiceJourney', () => {
  it('should copy correctly', () => {
    const copies = copyServiceJourney(
      {
        passingTimes: [
          {
            arrivalTime: '11:00:00',
            arrivalDayOffset: 0,
            departureTime: '11:00:00',
            departureDayOffset: 0,
          },
          {
            arrivalTime: '11:03:00',
            arrivalDayOffset: 0,
            departureTime: '11:03:00',
            departureDayOffset: 0,
          },
          {
            arrivalTime: '11:05:00',
            arrivalDayOffset: 0,
            departureTime: '11:05:00',
            departureDayOffset: 0,
          },
          {
            arrivalTime: '11:10:00',
            arrivalDayOffset: 0,
            departureTime: '11:10:00',
            departureDayOffset: 0,
          },
        ],
      },
      [],
      'Departure <% time %>',
      '12:00:00',
      0,
      '13:00:00',
      0,
      duration.parse('PT10M'),
    );

    expect(copies.length).toBe(6);

    expect(copies[5].passingTimes[0].arrivalTime).toBe('12:00:00');
    expect(copies[5].passingTimes[0].departureTime).toBe('12:00:00');
    expect(copies[5].passingTimes[1].arrivalTime).toBe('12:03:00');
    expect(copies[5].passingTimes[1].departureTime).toBe('12:03:00');
    expect(copies[5].passingTimes[2].arrivalTime).toBe('12:05:00');
    expect(copies[5].passingTimes[2].departureTime).toBe('12:05:00');
    expect(copies[5].passingTimes[3].arrivalTime).toBe('12:10:00');
    expect(copies[5].passingTimes[3].departureTime).toBe('12:10:00');
  });
});

describe('CopyDialog UI', () => {
  const sj = createServiceJourney({
    name: 'Morning Route',
    passingTimes: [
      {
        departureTime: '09:00:00',
        departureDayOffset: 0,
        arrivalTime: '09:00:00',
        arrivalDayOffset: 0,
      },
    ],
  });

  const renderDialog = (props = {}) => {
    return render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CopyDialog
          open={true}
          serviceJourney={sj}
          onSave={vi.fn()}
          onDismiss={vi.fn()}
          {...props}
        />
      </LocalizationProvider>,
    );
  };

  it('renders dialog title and fields', () => {
    renderDialog();
    expect(screen.getByText('Copy Service Journey')).toBeInTheDocument();
    expect(screen.getByLabelText('Name template')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create copies')).toBeInTheDocument();
  });

  it('renders name template with default value', () => {
    renderDialog();
    expect(screen.getByLabelText('Name template')).toHaveValue(
      'Morning Route (<% number %>)',
    );
  });

  it('shows multiple copy controls when switch is toggled', async () => {
    const user = userEvent.setup();
    renderDialog();

    // Find the switch label and click it to toggle
    const switchLabel = screen.getByText('Create multiple copies');
    expect(switchLabel).toBeInTheDocument();

    // Toggle the switch on
    await user.click(switchLabel);

    // The interval label should now be visible
    expect(screen.getByText('Choose an interval')).toBeInTheDocument();
  });

  it('calls onDismiss when Cancel is clicked', async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    renderDialog({ onDismiss });

    await user.click(screen.getByText('Cancel'));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls onSave when Create copies is clicked', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    renderDialog({ onSave });

    await user.click(screen.getByText('Create copies'));
    expect(onSave).toHaveBeenCalled();
  });

  it('does not render when open is false', () => {
    renderDialog({ open: false });
    expect(screen.queryByText('Copy Service Journey')).not.toBeInTheDocument();
  });

  it('calls onSave with multiple service journeys when multiple is toggled', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();

    const sjWithTimes = createServiceJourney({
      name: 'Route A',
      passingTimes: [
        {
          departureTime: '08:00:00',
          departureDayOffset: 0,
          arrivalTime: '08:00:00',
          arrivalDayOffset: 0,
        },
        {
          departureTime: '08:30:00',
          departureDayOffset: 0,
          arrivalTime: '08:30:00',
          arrivalDayOffset: 0,
        },
      ],
    });

    renderDialog({ onSave, serviceJourney: sjWithTimes });

    // Toggle multiple switch
    await user.click(screen.getByText('Create multiple copies'));

    // The interval and "until" time fields should now be visible
    expect(screen.getByText('Choose an interval')).toBeInTheDocument();

    // Click save — with default until = departure time, should produce at least 1 copy
    await user.click(screen.getByText('Create copies'));
    expect(onSave).toHaveBeenCalled();
  });

  it('updates name template when typed into', async () => {
    const user = userEvent.setup();
    renderDialog();

    const nameInput = screen.getByLabelText('Name template');
    await user.clear(nameInput);
    await user.type(nameInput, 'Custom <% number %>');
    expect(nameInput).toHaveValue('Custom <% number %>');
  });
});
