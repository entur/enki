import React from 'react';

import { InputGroup } from '@entur/form';
import { FilterChip } from '@entur/chip';

import './styles.scss';
import { DAY_OF_WEEK } from '../../model/enums';

type Props = {
  days: DAY_OF_WEEK[];
  onDaysChange: (days: DAY_OF_WEEK[]) => void;
  feedbackMessage?: string;
};

export const toggleDay = (
  days: DAY_OF_WEEK[],
  dayToToggle: DAY_OF_WEEK
): DAY_OF_WEEK[] =>
  days.includes(dayToToggle)
    ? days.filter((day) => day !== dayToToggle)
    : days.concat(dayToToggle);

const WeekdayPicker = ({ days, onDaysChange, feedbackMessage }: Props) => (
  <InputGroup
    className="weekday-picker"
    variant={days.length === 0 ? 'error' : undefined}
    feedback={feedbackMessage}
  >
    <div className="checkboxes">
      <FilterChip
        checked={days.includes(DAY_OF_WEEK.MONDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.MONDAY))}
        value="M"
      >
        M
      </FilterChip>
      <FilterChip
        checked={days.includes(DAY_OF_WEEK.TUESDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.TUESDAY))}
        value="T"
      >
        T
      </FilterChip>
      <FilterChip
        checked={days.includes(DAY_OF_WEEK.WEDNESDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.WEDNESDAY))}
        value="O"
      >
        O
      </FilterChip>
      <FilterChip
        checked={days.includes(DAY_OF_WEEK.THURSDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.THURSDAY))}
        value="T"
      >
        T
      </FilterChip>
      <FilterChip
        checked={days.includes(DAY_OF_WEEK.FRIDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.FRIDAY))}
        value="F"
      >
        F
      </FilterChip>
      <FilterChip
        checked={days.includes(DAY_OF_WEEK.SATURDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.SATURDAY))}
        value="L"
      >
        L
      </FilterChip>
      <FilterChip
        checked={days.includes(DAY_OF_WEEK.SUNDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.SUNDAY))}
        value="S"
      >
        S
      </FilterChip>
    </div>
  </InputGroup>
);

export default WeekdayPicker;
