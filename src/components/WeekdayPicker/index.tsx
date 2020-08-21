import React from 'react';

import { InputGroup } from '@entur/form';
import { FilterChip } from '@entur/chip';
import { DAY_OF_WEEK } from 'model/enums';
import usePristine from 'hooks/usePristine';
import { getErrorFeedback } from 'helpers/errorHandling';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import './styles.scss';

type Props = {
  days: DAY_OF_WEEK[];
  onChange: (days: DAY_OF_WEEK[]) => void;
  spoilPristine: boolean;
};

export const toggleDay = (
  days: DAY_OF_WEEK[],
  dayToToggle: DAY_OF_WEEK
): DAY_OF_WEEK[] =>
  days.includes(dayToToggle)
    ? days.filter((day) => day !== dayToToggle)
    : [...days, dayToToggle];

const WeekdayPicker = ({ days, onChange, spoilPristine }: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const weekdayPristine = usePristine(days, spoilPristine);

  return (
    <InputGroup
      className="weekday-picker"
      {...getErrorFeedback(
        formatMessage('weekdaysError'),
        days.length !== 0,
        weekdayPristine
      )}
    >
      <div className="checkboxes">
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.MONDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.MONDAY))}
          value="M"
        >
          {formatMessage('weekdaysMonday')}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.TUESDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.TUESDAY))}
          value="T"
        >
          {formatMessage('weekdaysTuesday')}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.WEDNESDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.WEDNESDAY))}
          value="O"
        >
          {formatMessage('weekdaysWednesday')}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.THURSDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.THURSDAY))}
          value="T"
        >
          {formatMessage('weekdaysThursday')}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.FRIDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.FRIDAY))}
          value="F"
        >
          {formatMessage('weekdaysFriday')}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.SATURDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.SATURDAY))}
          value="L"
        >
          {formatMessage('weekdaysSaturday')}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.SUNDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.SUNDAY))}
          value="S"
        >
          {formatMessage('weekdaysSunday')}
        </FilterChip>
      </div>
    </InputGroup>
  );
};

export default WeekdayPicker;
