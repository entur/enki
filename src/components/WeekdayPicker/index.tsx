import React from 'react';

import { InputGroup } from '@entur/form';
import { FilterChip } from '@entur/chip';
import { DAY_OF_WEEK } from 'model/enums';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';
import messages from './messages';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import './styles.scss';

type Props = {
  days: DAY_OF_WEEK[];
  onDaysChange: (days: DAY_OF_WEEK[]) => void;
  spoilPristine: boolean;
};

export const toggleDay = (
  days: DAY_OF_WEEK[],
  dayToToggle: DAY_OF_WEEK
): DAY_OF_WEEK[] =>
  days.includes(dayToToggle)
    ? days.filter((day) => day !== dayToToggle)
    : days.concat(dayToToggle);

const WeekdayPicker = ({ days, onDaysChange, spoilPristine }: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const weekdayPristine = usePristine(days, spoilPristine);

  return (
    <InputGroup
      className="weekday-picker"
      {...getErrorFeedback(
        formatMessage(messages.availabilityMustBeFilled),
        days.length !== 0,
        weekdayPristine
      )}
    >
      <div className="checkboxes">
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.MONDAY)}
          onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.MONDAY))}
          value="M"
        >
          {formatMessage(messages.monday)}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.TUESDAY)}
          onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.TUESDAY))}
          value="T"
        >
          {formatMessage(messages.tuesday)}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.WEDNESDAY)}
          onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.WEDNESDAY))}
          value="O"
        >
          {formatMessage(messages.wednesday)}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.THURSDAY)}
          onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.THURSDAY))}
          value="T"
        >
          {formatMessage(messages.thursday)}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.FRIDAY)}
          onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.FRIDAY))}
          value="F"
        >
          {formatMessage(messages.friday)}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.SATURDAY)}
          onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.SATURDAY))}
          value="L"
        >
          {formatMessage(messages.saturday)}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.SUNDAY)}
          onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.SUNDAY))}
          value="S"
        >
          {formatMessage(messages.sunday)}
        </FilterChip>
      </div>
    </InputGroup>
  );
};

export default WeekdayPicker;
