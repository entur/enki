import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { toDate } from './toDate';

type Props = {
  label: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: string | null) => void;
  selectedTime: string | null | undefined;
  ignoreSelectedTime?: boolean;
};

export const PassingTimePicker = ({
  label,
  disabled = false,
  required = false,
  onChange,
  selectedTime,
  ignoreSelectedTime = false,
}: Props) => {
  const timeValue =
    disabled || !selectedTime || ignoreSelectedTime
      ? null
      : toDate(selectedTime) || null;

  return (
    <TimePicker
      disabled={disabled}
      label={`${label}${required ? ' *' : ''}`}
      className="timepicker"
      value={timeValue}
      onChange={(newValue: Date | null) => {
        if (newValue) {
          const timeString = newValue.toTimeString().split(' ')[0];
          onChange(timeString);
        } else {
          onChange(null);
        }
      }}
      ampm={false}
    />
  );
};
