import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import { PassingTimePicker } from './PassingTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const renderPicker = (
  props: Partial<Parameters<typeof PassingTimePicker>[0]> = {},
) => {
  const defaultProps = {
    label: 'Departure',
    onChange: vi.fn(),
    selectedTime: null as string | null,
    ...props,
  };
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <PassingTimePicker {...defaultProps} />
    </LocalizationProvider>,
  );
};

/**
 * MUI v7 TimePicker renders multi-section inputs with role="spinbutton"
 * for Hours and Minutes instead of a standard <input>.
 * We query these spinbuttons via aria-label and check aria-valuenow/aria-valuetext.
 */
describe('PassingTimePicker', () => {
  it('renders with the label text', () => {
    renderPicker();
    const label = screen.getByText('Departure', { selector: 'label' });
    expect(label).toBeInTheDocument();
  });

  it('renders with required label suffix', () => {
    renderPicker({ required: true });
    const label = screen.getByText('Departure *', { selector: 'label' });
    expect(label).toBeInTheDocument();
  });

  it('renders hours and minutes spinbuttons', () => {
    renderPicker();
    expect(
      screen.getByRole('spinbutton', { name: 'Hours' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: 'Minutes' }),
    ).toBeInTheDocument();
  });

  it('shows time value when selectedTime is provided', () => {
    renderPicker({ selectedTime: '14:30:00' });
    const hours = screen.getByRole('spinbutton', { name: 'Hours' });
    const minutes = screen.getByRole('spinbutton', { name: 'Minutes' });
    expect(hours).toHaveAttribute('aria-valuenow', '14');
    expect(minutes).toHaveAttribute('aria-valuenow', '30');
  });

  it('shows empty when selectedTime is null', () => {
    renderPicker({ selectedTime: null });
    const hours = screen.getByRole('spinbutton', { name: 'Hours' });
    const minutes = screen.getByRole('spinbutton', { name: 'Minutes' });
    expect(hours).toHaveAttribute('aria-valuetext', 'Empty');
    expect(minutes).toHaveAttribute('aria-valuetext', 'Empty');
  });

  it('shows empty when ignoreSelectedTime is true', () => {
    renderPicker({ selectedTime: '14:30:00', ignoreSelectedTime: true });
    const hours = screen.getByRole('spinbutton', { name: 'Hours' });
    const minutes = screen.getByRole('spinbutton', { name: 'Minutes' });
    expect(hours).toHaveAttribute('aria-valuetext', 'Empty');
    expect(minutes).toHaveAttribute('aria-valuetext', 'Empty');
  });

  it('renders disabled spinbuttons when disabled prop is true', () => {
    renderPicker({ disabled: true });
    const hours = screen.getByRole('spinbutton', { name: 'Hours' });
    const minutes = screen.getByRole('spinbutton', { name: 'Minutes' });
    expect(hours).toHaveAttribute('aria-disabled', 'true');
    expect(minutes).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows empty when disabled even with selectedTime', () => {
    renderPicker({ disabled: true, selectedTime: '09:15:00' });
    const hours = screen.getByRole('spinbutton', { name: 'Hours' });
    const minutes = screen.getByRole('spinbutton', { name: 'Minutes' });
    expect(hours).toHaveAttribute('aria-valuetext', 'Empty');
    expect(minutes).toHaveAttribute('aria-valuetext', 'Empty');
  });
});
