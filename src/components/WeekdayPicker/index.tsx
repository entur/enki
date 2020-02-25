import React from 'react';

import ContentCheckbox from '../ContentCheckbox';
import { InputGroup } from '@entur/form';

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
    ? days.filter(day => day !== dayToToggle)
    : days.concat(dayToToggle);

const WeekdayPicker = ({ days, onDaysChange, feedbackMessage }: Props) => (
  <InputGroup
    className="weekday-picker"
    variant={days.length === 0 ? 'error' : undefined}
    feedback={feedbackMessage}
  >
    <div className="checkboxes">
      <ContentCheckbox
        isChecked={days.includes(DAY_OF_WEEK.MONDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.MONDAY))}
      >
        M
      </ContentCheckbox>
      <ContentCheckbox
        isChecked={days.includes(DAY_OF_WEEK.TUESDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.TUESDAY))}
      >
        T
      </ContentCheckbox>
      <ContentCheckbox
        isChecked={days.includes(DAY_OF_WEEK.WEDNESDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.WEDNESDAY))}
      >
        O
      </ContentCheckbox>
      <ContentCheckbox
        isChecked={days.includes(DAY_OF_WEEK.THURSDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.THURSDAY))}
      >
        T
      </ContentCheckbox>
      <ContentCheckbox
        isChecked={days.includes(DAY_OF_WEEK.FRIDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.FRIDAY))}
      >
        F
      </ContentCheckbox>
      <ContentCheckbox
        isChecked={days.includes(DAY_OF_WEEK.SATURDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.SATURDAY))}
      >
        L
      </ContentCheckbox>
      <ContentCheckbox
        isChecked={days.includes(DAY_OF_WEEK.SUNDAY)}
        onChange={() => onDaysChange(toggleDay(days, DAY_OF_WEEK.SUNDAY))}
      >
        S
      </ContentCheckbox>
    </div>
  </InputGroup>
);

export default WeekdayPicker;
