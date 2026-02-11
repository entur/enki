import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import DayOffsetDropdown from './index';

describe('DayOffsetDropdown', () => {
  it('renders with default value 0', () => {
    render(<DayOffsetDropdown value={0} onChange={vi.fn()} />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('0');
  });

  it('renders with value 1', () => {
    render(<DayOffsetDropdown value={1} onChange={vi.fn()} />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('1');
  });

  it('renders with value 5', () => {
    render(<DayOffsetDropdown value={5} onChange={vi.fn()} />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('5');
  });

  it('defaults to 0 when value is undefined', () => {
    render(<DayOffsetDropdown onChange={vi.fn()} />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('0');
  });

  it('calls onChange when a new value is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DayOffsetDropdown value={0} onChange={onChange} />);

    const input = screen.getByRole('combobox');
    await user.click(input);

    // Select option "3" from the dropdown
    const option = await screen.findByRole('option', { name: '3' });
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('is disabled when disabled prop is true', () => {
    render(<DayOffsetDropdown value={0} onChange={vi.fn()} disabled={true} />);

    const input = screen.getByRole('combobox');
    expect(input).toBeDisabled();
  });

  it('is not disabled by default', () => {
    render(<DayOffsetDropdown value={0} onChange={vi.fn()} />);

    const input = screen.getByRole('combobox');
    expect(input).not.toBeDisabled();
  });

  it('shows the day offset label', () => {
    render(<DayOffsetDropdown value={0} onChange={vi.fn()} />);

    expect(screen.getByLabelText('Day offset')).toBeInTheDocument();
  });
});
