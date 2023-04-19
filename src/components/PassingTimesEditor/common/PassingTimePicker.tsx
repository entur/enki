import {
  nativeDateToTimeOrDateValue,
  timeOrDateValueToNativeDate,
  TimePicker,
} from '@entur/datepicker';
import { toDate } from './toDate';
import { TimeValue } from '@react-types/datepicker';
import { AppIntlState, selectIntl } from 'i18n';
import { useSelector } from 'react-redux';
import { GlobalState } from 'reducers';

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
  const { locale } = useSelector<GlobalState, AppIntlState>(selectIntl);
  return (
    <TimePicker
      locale={locale}
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
