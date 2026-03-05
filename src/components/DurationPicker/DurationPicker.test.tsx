import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import { formatDuration } from './index';
import DurationPicker from './index';

// Create a minimal intl-like object for testing formatDuration
const createMockIntl = () => ({
  formatMessage: (
    { defaultMessage }: { id: string; defaultMessage: string },
    values?: Record<string, number>,
  ) => {
    if (!defaultMessage || !values) return defaultMessage || '';
    return Object.entries(values).reduce(
      (msg, [key, val]) => msg.replace(`{${key}}`, String(val)),
      defaultMessage,
    );
  },
});

describe('formatDuration', () => {
  const intl = createMockIntl();

  it('formats years only', () => {
    const result = formatDuration({ years: 2 }, intl);
    expect(result).toBe('2 years');
  });

  it('formats months only', () => {
    const result = formatDuration({ months: 3 }, intl);
    expect(result).toBe('3 months');
  });

  it('formats days only', () => {
    const result = formatDuration({ days: 10 }, intl);
    expect(result).toBe('10 days');
  });

  it('formats hours only', () => {
    const result = formatDuration({ hours: 5 }, intl);
    expect(result).toBe('5 hours');
  });

  it('formats minutes only', () => {
    const result = formatDuration({ minutes: 30 }, intl);
    expect(result).toBe('30 minutes');
  });

  it('formats seconds only', () => {
    const result = formatDuration({ seconds: 45 }, intl);
    expect(result).toBe('45 seconds');
  });

  it('formats multiple units combined', () => {
    const result = formatDuration({ hours: 2, minutes: 30 }, intl);
    expect(result).toBe('2 hours, 30 minutes');
  });

  it('formats all units', () => {
    const result = formatDuration(
      { years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6 },
      intl,
    );
    expect(result).toBe(
      '1 years, 2 months, 3 days, 4 hours, 5 minutes, 6 seconds',
    );
  });

  it('returns empty string for an empty duration', () => {
    const result = formatDuration({}, intl);
    expect(result).toBe('');
  });

  it('skips zero-value fields', () => {
    const result = formatDuration({ hours: 0, minutes: 15 }, intl);
    expect(result).toBe('15 minutes');
  });
});

describe('DurationPicker component', () => {
  it('renders without crashing with no duration', () => {
    const onChange = vi.fn();
    render(<DurationPicker onChange={onChange} />);

    // Should render a text input
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders the text value for a given duration', () => {
    const onChange = vi.fn();
    render(<DurationPicker onChange={onChange} duration="PT2H30M" />);

    const textbox = screen.getByRole('textbox');
    expect(textbox).toHaveValue('2 hours, 30 minutes');
  });

  it('renders with a days-only duration', () => {
    const onChange = vi.fn();
    render(<DurationPicker onChange={onChange} duration="P5D" />);

    const textbox = screen.getByRole('textbox');
    expect(textbox).toHaveValue('5 days');
  });

  it('renders empty value when duration is empty string', () => {
    const onChange = vi.fn();
    render(<DurationPicker onChange={onChange} duration="" />);

    const textbox = screen.getByRole('textbox');
    expect(textbox).toHaveValue('');
  });
});
