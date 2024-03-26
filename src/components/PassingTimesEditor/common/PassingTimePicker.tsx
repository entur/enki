import {
  nativeDateToTimeValue,
  timeOrDateValueToNativeDate,
  TimePicker,
} from '@entur/datepicker';
import { TimeValue } from '@react-types/datepicker';
import { useIntl } from 'react-intl';
import { toDate } from './toDate';

type Props = {
  label: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: string | null) => void;
  selectedTime: string | null | undefined;
};

export const PassingTimePicker = ({
  label,
  disabled = false,
  required = false,
  onChange,
  selectedTime,
}: Props) => {
  const { locale } = useIntl();
  return (
    <TimePicker
      locale={locale}
      disabled={disabled}
      label={`${label}${required ? ' *' : ''}`}
      className="timepicker"
      onChange={(timeValue: TimeValue | null) => {
        let date = null;
        if (timeValue) {
          date = timeOrDateValueToNativeDate(timeValue)
            ?.toTimeString()
            .split(' ')[0];
        }
        onChange(date ?? null);
      }}
      selectedTime={
        disabled || !selectedTime
          ? null
          : nativeDateToTimeValue(toDate(selectedTime!)!)
      }
    />
  );
};
