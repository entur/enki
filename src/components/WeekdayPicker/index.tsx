import { Chip, FormHelperText } from '@mui/material';
import usePristine from 'hooks/usePristine';
import { DAY_OF_WEEK } from 'model/enums';
import { useIntl } from 'react-intl';

type Props = {
  days: DAY_OF_WEEK[];
  onChange: (days: DAY_OF_WEEK[]) => void;
  spoilPristine: boolean;
};

export const toggleDay = (
  days: DAY_OF_WEEK[],
  dayToToggle: DAY_OF_WEEK,
): DAY_OF_WEEK[] =>
  days.includes(dayToToggle)
    ? days.filter((day) => day !== dayToToggle)
    : [...days, dayToToggle];

const WeekdayPicker = ({ days, onChange, spoilPristine }: Props) => {
  const { formatMessage } = useIntl();
  const weekdayPristine = usePristine(days, spoilPristine);
  const isValid = days.length !== 0;
  const showError = !isValid && !weekdayPristine;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        <Chip
          label={formatMessage({ id: 'weekdaysMonday' })}
          variant={days.includes(DAY_OF_WEEK.MONDAY) ? 'filled' : 'outlined'}
          color={days.includes(DAY_OF_WEEK.MONDAY) ? 'primary' : 'default'}
          onClick={() => onChange(toggleDay(days, DAY_OF_WEEK.MONDAY))}
        />
        <Chip
          label={formatMessage({ id: 'weekdaysTuesday' })}
          variant={days.includes(DAY_OF_WEEK.TUESDAY) ? 'filled' : 'outlined'}
          color={days.includes(DAY_OF_WEEK.TUESDAY) ? 'primary' : 'default'}
          onClick={() => onChange(toggleDay(days, DAY_OF_WEEK.TUESDAY))}
        />
        <Chip
          label={formatMessage({ id: 'weekdaysWednesday' })}
          variant={days.includes(DAY_OF_WEEK.WEDNESDAY) ? 'filled' : 'outlined'}
          color={days.includes(DAY_OF_WEEK.WEDNESDAY) ? 'primary' : 'default'}
          onClick={() => onChange(toggleDay(days, DAY_OF_WEEK.WEDNESDAY))}
        />
        <Chip
          label={formatMessage({ id: 'weekdaysThursday' })}
          variant={days.includes(DAY_OF_WEEK.THURSDAY) ? 'filled' : 'outlined'}
          color={days.includes(DAY_OF_WEEK.THURSDAY) ? 'primary' : 'default'}
          onClick={() => onChange(toggleDay(days, DAY_OF_WEEK.THURSDAY))}
        />
        <Chip
          label={formatMessage({ id: 'weekdaysFriday' })}
          variant={days.includes(DAY_OF_WEEK.FRIDAY) ? 'filled' : 'outlined'}
          color={days.includes(DAY_OF_WEEK.FRIDAY) ? 'primary' : 'default'}
          onClick={() => onChange(toggleDay(days, DAY_OF_WEEK.FRIDAY))}
        />
        <Chip
          label={formatMessage({ id: 'weekdaysSaturday' })}
          variant={days.includes(DAY_OF_WEEK.SATURDAY) ? 'filled' : 'outlined'}
          color={days.includes(DAY_OF_WEEK.SATURDAY) ? 'primary' : 'default'}
          onClick={() => onChange(toggleDay(days, DAY_OF_WEEK.SATURDAY))}
        />
        <Chip
          label={formatMessage({ id: 'weekdaysSunday' })}
          variant={days.includes(DAY_OF_WEEK.SUNDAY) ? 'filled' : 'outlined'}
          color={days.includes(DAY_OF_WEEK.SUNDAY) ? 'primary' : 'default'}
          onClick={() => onChange(toggleDay(days, DAY_OF_WEEK.SUNDAY))}
        />
      </div>
      {showError && (
        <FormHelperText error>
          {formatMessage({ id: 'weekdaysError' })}
        </FormHelperText>
      )}
    </div>
  );
};

export default WeekdayPicker;
