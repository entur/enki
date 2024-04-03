import { FilterChip } from '@entur/chip';
import { FeedbackText } from '@entur/form';
import { getErrorFeedback } from 'helpers/errorHandling';
import usePristine from 'hooks/usePristine';
import { DAY_OF_WEEK } from 'model/enums';
import { useIntl } from 'react-intl';
import './styles.scss';

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
  const { feedback, variant } = getErrorFeedback(
    formatMessage({ id: 'weekdaysError' }),
    days.length !== 0,
    weekdayPristine,
  );

  return (
    <div className="weekday-picker">
      <div className="checkboxes">
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.MONDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.MONDAY))}
          value="M"
        >
          {formatMessage({ id: 'weekdaysMonday' })}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.TUESDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.TUESDAY))}
          value="T"
        >
          {formatMessage({ id: 'weekdaysTuesday' })}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.WEDNESDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.WEDNESDAY))}
          value="O"
        >
          {formatMessage({ id: 'weekdaysWednesday' })}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.THURSDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.THURSDAY))}
          value="T"
        >
          {formatMessage({ id: 'weekdaysThursday' })}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.FRIDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.FRIDAY))}
          value="F"
        >
          {formatMessage({ id: 'weekdaysFriday' })}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.SATURDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.SATURDAY))}
          value="L"
        >
          {formatMessage({ id: 'weekdaysSaturday' })}
        </FilterChip>
        <FilterChip
          checked={days.includes(DAY_OF_WEEK.SUNDAY)}
          onChange={() => onChange(toggleDay(days, DAY_OF_WEEK.SUNDAY))}
          value="S"
        >
          {formatMessage({ id: 'weekdaysSunday' })}
        </FilterChip>
      </div>
      <FeedbackText variant={variant!}>{feedback}</FeedbackText>
    </div>
  );
};

export default WeekdayPicker;
