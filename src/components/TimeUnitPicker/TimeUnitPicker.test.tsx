import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import TimeUnitPicker, { TimeUnitPickerPosition } from './index';

const defaultProps = {
  onUnitChange: vi.fn(),
  onReset: vi.fn(),
};

describe('TimeUnitPicker', () => {
  it('renders a read-only text field', () => {
    render(<TimeUnitPicker {...defaultProps} />);

    const textbox = screen.getByRole('textbox');
    expect(textbox).toBeInTheDocument();
    expect(textbox).toHaveAttribute('readonly');
  });

  it('displays the provided textValue', () => {
    render(
      <TimeUnitPicker {...defaultProps} textValue="2 hours, 30 minutes" />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('2 hours, 30 minutes');
  });

  it('opens the picker panel on mousedown', () => {
    render(<TimeUnitPicker {...defaultProps} />);

    // Initially no "Done" button (picker is closed)
    expect(screen.queryByText('Done')).not.toBeInTheDocument();

    // Click the text field to open the picker
    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    // Now the picker panel with "Done" button should appear
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows the Reset button when picker is open', () => {
    render(<TimeUnitPicker {...defaultProps} />);

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('renders year, month, day, hour, minute pickers by default', () => {
    render(<TimeUnitPicker {...defaultProps} />);

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    expect(screen.getByLabelText('Years')).toBeInTheDocument();
    expect(screen.getByLabelText('Months')).toBeInTheDocument();
    expect(screen.getByLabelText('Days')).toBeInTheDocument();
    expect(screen.getByLabelText('Hours')).toBeInTheDocument();
    expect(screen.getByLabelText('Minutes')).toBeInTheDocument();
  });

  it('does not render seconds by default', () => {
    render(<TimeUnitPicker {...defaultProps} />);

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    expect(screen.queryByLabelText('Seconds')).not.toBeInTheDocument();
  });

  it('renders seconds when showSeconds is true', () => {
    render(<TimeUnitPicker {...defaultProps} showSeconds={true} />);

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    expect(screen.getByLabelText('Seconds')).toBeInTheDocument();
  });

  it('hides units when show* flags are false', () => {
    render(
      <TimeUnitPicker
        {...defaultProps}
        showYears={false}
        showMonths={false}
        showDays={false}
      />,
    );

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    expect(screen.queryByLabelText('Years')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Months')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Days')).not.toBeInTheDocument();
    // Hours and Minutes should still be present
    expect(screen.getByLabelText('Hours')).toBeInTheDocument();
    expect(screen.getByLabelText('Minutes')).toBeInTheDocument();
  });

  it('closes the picker when Done is clicked', async () => {
    const user = userEvent.setup();
    render(<TimeUnitPicker {...defaultProps} />);

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    expect(screen.getByText('Done')).toBeInTheDocument();

    await user.click(screen.getByText('Done'));

    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });

  it('does not open picker when disabled', () => {
    render(<TimeUnitPicker {...defaultProps} disabled={true} />);

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });

  it('calls onReset and closes picker when Reset is clicked', async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();
    render(<TimeUnitPicker {...defaultProps} onReset={onReset} />);

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    await user.click(screen.getByText('Reset'));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });

  it('positions picker below the trigger when position is BELOW', () => {
    const { container } = render(
      <TimeUnitPicker
        {...defaultProps}
        position={TimeUnitPickerPosition.BELOW}
      />,
    );

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    // Picker panel should be visible
    expect(screen.getByText('Done')).toBeInTheDocument();
    // The BELOW position applies marginTop instead of bottom
    const pickerPanel = screen
      .getByText('Done')
      .closest('div[style*="position: absolute"]') as HTMLElement;
    expect(pickerPanel).toBeInTheDocument();
    expect(pickerPanel.style.marginTop).toBe('15px');
  });

  it('positions picker above the trigger by default', () => {
    render(<TimeUnitPicker {...defaultProps} />);

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    const pickerPanel = screen
      .getByText('Done')
      .closest('div[style*="position: absolute"]') as HTMLElement;
    expect(pickerPanel).toBeInTheDocument();
    expect(pickerPanel.style.bottom).toBe('60px');
  });

  it('closes picker when clicking outside', () => {
    render(<TimeUnitPicker {...defaultProps} />);

    const textbox = screen.getByRole('textbox');
    fireEvent.mouseDown(textbox, { button: 0 });

    expect(screen.getByText('Done')).toBeInTheDocument();

    // Click outside both trigger and picker
    fireEvent.mouseDown(document.body, { button: 0 });

    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });
});
