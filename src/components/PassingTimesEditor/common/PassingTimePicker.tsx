import {
  SimpleTimePicker,
  nativeDateToTimeValue,
  timeOrDateValueToNativeDate,
} from '@entur/datepicker';
import { TimeValue } from '@react-types/datepicker';
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
  return (
    <SimpleTimePicker
      showClockIcon
      hourCycle={24}
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
        onChange(date);
      }}
      selectedTime={
        disabled || !selectedTime
          ? null
          : nativeDateToTimeValue(toDate(selectedTime!)!)
      }
    />
  );
};
