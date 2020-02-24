import React from 'react';

import ContentCheckbox from '../ContentCheckbox';
import { InputGroup } from '@entur/form';

import './styles.scss';

type Props = {
  days: boolean[];
  onDaysChange: (days: boolean[]) => void;
};

const WeekdayPicker = ({ days, onDaysChange }: Props) => {
  const handleDayChange = (i: number) => {
    const daysArr = days.slice();
    daysArr[i] = !daysArr[i];
    onDaysChange(daysArr);
  };

  return (
    <InputGroup className="weekday-picker">
      <div className="checkboxes">
        <ContentCheckbox
          isChecked={days[0]}
          onChange={() => handleDayChange(0)}
        >
          M
        </ContentCheckbox>
        <ContentCheckbox
          isChecked={days[1]}
          onChange={() => handleDayChange(1)}
        >
          T
        </ContentCheckbox>
        <ContentCheckbox
          isChecked={days[2]}
          onChange={() => handleDayChange(2)}
        >
          O
        </ContentCheckbox>
        <ContentCheckbox
          isChecked={days[3]}
          onChange={() => handleDayChange(3)}
        >
          T
        </ContentCheckbox>
        <ContentCheckbox
          isChecked={days[4]}
          onChange={() => handleDayChange(4)}
        >
          F
        </ContentCheckbox>
        <ContentCheckbox
          isChecked={days[5]}
          onChange={() => handleDayChange(5)}
        >
          L
        </ContentCheckbox>
        <ContentCheckbox
          isChecked={days[6]}
          onChange={() => handleDayChange(6)}
        >
          S
        </ContentCheckbox>
      </div>
    </InputGroup>
  );
};

export default WeekdayPicker;
