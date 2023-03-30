import {
  nativeDateToTimeOrDateValue,
  timeOrDateValueToNativeDate,
  TimePicker,
} from '@entur/datepicker';
import React from 'react';
import { toDate } from './toDate';
import { TimeValue } from '@react-types/datepicker';

type Props = {
  label: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: string) => void;
  selectedTime: string | null | undefined;
};

export const PassingTimePicker = ({
  label,
  disabled = false,
  required = false,
  onChange,
  selectedTime,
}: Props) => {
  return (
    <TimePicker
      disabled={disabled}
      label={`${label}${required ? ' *' : ''}`}
      className="timepicker"
      onChange={(e: TimeValue) => {
        const date = timeOrDateValueToNativeDate(e)
          ?.toTimeString()
          .split(' ')[0];
        onChange(date);
      }}
      selectedTime={
        disabled || !selectedTime
          ? null
          : (nativeDateToTimeOrDateValue(toDate(selectedTime!)!) as TimeValue)
      }
    />
  );
};
