import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
import WeekdayPicker, { toggleDay } from './index';
import { DAY_OF_WEEK } from 'model/enums';

describe('WeekdayPicker utils', () => {
  describe('toggleDay', () => {
    it('should add day if it is not in the array', () => {
      expect(
        toggleDay(
          [DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.FRIDAY],
          DAY_OF_WEEK.WEDNESDAY,
        ),
      ).toEqual([
        DAY_OF_WEEK.MONDAY,
        DAY_OF_WEEK.FRIDAY,
        DAY_OF_WEEK.WEDNESDAY,
      ]);
    });

    it('should remove day if it is in the array', () => {
      expect(
        toggleDay([DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.FRIDAY], DAY_OF_WEEK.FRIDAY),
      ).toEqual([DAY_OF_WEEK.MONDAY]);
    });
  });
});

describe('WeekdayPicker component', () => {
  it('renders all 7 day chips', () => {
    render(
      <WeekdayPicker days={[]} onChange={vi.fn()} spoilPristine={false} />,
    );
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
    expect(screen.getByText('Wednesday')).toBeInTheDocument();
    expect(screen.getByText('Thursday')).toBeInTheDocument();
    expect(screen.getByText('Friday')).toBeInTheDocument();
    expect(screen.getByText('Saturday')).toBeInTheDocument();
    expect(screen.getByText('Sunday')).toBeInTheDocument();
  });

  it('calls onChange with added day when clicking unselected chip', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <WeekdayPicker
        days={[DAY_OF_WEEK.MONDAY]}
        onChange={onChange}
        spoilPristine={false}
      />,
    );
    await user.click(screen.getByText('Wednesday'));
    expect(onChange).toHaveBeenCalledWith([
      DAY_OF_WEEK.MONDAY,
      DAY_OF_WEEK.WEDNESDAY,
    ]);
  });

  it('calls onChange without removed day when clicking selected chip', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <WeekdayPicker
        days={[DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.FRIDAY]}
        onChange={onChange}
        spoilPristine={false}
      />,
    );
    await user.click(screen.getByText('Friday'));
    expect(onChange).toHaveBeenCalledWith([DAY_OF_WEEK.MONDAY]);
  });

  it('shows error when days are empty and spoilPristine is true', () => {
    render(<WeekdayPicker days={[]} onChange={vi.fn()} spoilPristine={true} />);
    expect(
      screen.getByText('Please fill in the availability.'),
    ).toBeInTheDocument();
  });

  it('does not show error when days are empty but pristine', () => {
    render(
      <WeekdayPicker days={[]} onChange={vi.fn()} spoilPristine={false} />,
    );
    expect(
      screen.queryByText('Please fill in the availability.'),
    ).not.toBeInTheDocument();
  });

  it('does not show error when days are non-empty', () => {
    render(
      <WeekdayPicker
        days={[DAY_OF_WEEK.MONDAY]}
        onChange={vi.fn()}
        spoilPristine={true}
      />,
    );
    expect(
      screen.queryByText('Please fill in the availability.'),
    ).not.toBeInTheDocument();
  });

  it('renders selected chips with filled variant', () => {
    const allDays = [
      DAY_OF_WEEK.MONDAY,
      DAY_OF_WEEK.TUESDAY,
      DAY_OF_WEEK.WEDNESDAY,
      DAY_OF_WEEK.THURSDAY,
      DAY_OF_WEEK.FRIDAY,
      DAY_OF_WEEK.SATURDAY,
      DAY_OF_WEEK.SUNDAY,
    ];
    render(
      <WeekdayPicker days={allDays} onChange={vi.fn()} spoilPristine={false} />,
    );
    const chips = screen.getAllByRole('button');
    chips.forEach((chip) => {
      expect(chip).toHaveClass('MuiChip-filled');
    });
  });

  it('renders unselected chips with outlined variant', () => {
    render(
      <WeekdayPicker days={[]} onChange={vi.fn()} spoilPristine={false} />,
    );
    const chips = screen.getAllByRole('button');
    chips.forEach((chip) => {
      expect(chip).toHaveClass('MuiChip-outlined');
    });
  });
});
