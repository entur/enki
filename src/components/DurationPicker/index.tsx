import cx from 'classnames';
import * as durationLib from 'duration-fns';
import { useIntl } from 'react-intl';
import TimeUnitPicker, { TimeUnitPickerPosition } from '../TimeUnitPicker';

type Props = {
  onChange: (duration?: string) => void;
  duration?: string;
  resetOnZero?: boolean;
  showYears?: boolean;
  showMonths?: boolean;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  position?: TimeUnitPickerPosition;
  className?: string;
  disabled?: boolean;
};

const formatDuration = (duration: any, intl: any) => {
  const parts = [];
  if (duration.years) {
    parts.push(
      intl.formatMessage(
        { id: 'duration.years', defaultMessage: '{years} years' },
        { years: duration.years },
      ),
    );
  }
  if (duration.months) {
    parts.push(
      intl.formatMessage(
        { id: 'duration.months', defaultMessage: '{months} months' },
        { months: duration.months },
      ),
    );
  }
  if (duration.days) {
    parts.push(
      intl.formatMessage(
        { id: 'duration.days', defaultMessage: '{days} days' },
        { days: duration.days },
      ),
    );
  }
  if (duration.hours) {
    parts.push(
      intl.formatMessage(
        { id: 'duration.hours', defaultMessage: '{hours} hours' },
        { hours: duration.hours },
      ),
    );
  }
  if (duration.minutes) {
    parts.push(
      intl.formatMessage(
        { id: 'duration.minutes', defaultMessage: '{minutes} minutes' },
        { minutes: duration.minutes },
      ),
    );
  }
  if (duration.seconds) {
    parts.push(
      intl.formatMessage(
        { id: 'duration.seconds', defaultMessage: '{seconds} seconds' },
        { seconds: duration.seconds },
      ),
    );
  }
  return parts.join(', ');
};

export default (props: Props) => {
  const {
    onChange,
    duration = '',
    resetOnZero = false,
    showSeconds = false,
    showMinutes = true,
    showHours = true,
    showMonths = true,
    showYears = true,
    showDays = true,
    position = TimeUnitPickerPosition.ABOVE,
    className,
    disabled = false,
  } = props;

  const intl = useIntl();

  const parsedDuration = (() => {
    if (duration) {
      const durationObj = durationLib.parse(duration);
      return {
        ...durationObj,
        textValue: formatDuration(durationObj, intl),
      };
    } else {
      return undefined;
    }
  })();

  const handleOnUnitChange = (unit: string, value: number) => {
    const newDuration = {
      seconds: unit === 'seconds' ? value : parsedDuration?.seconds,
      minutes: unit === 'minutes' ? value : parsedDuration?.minutes,
      hours: unit === 'hours' ? value : parsedDuration?.hours,
      days: unit === 'days' ? value : parsedDuration?.days,
      months: unit === 'months' ? value : parsedDuration?.months,
      years: unit === 'years' ? value : parsedDuration?.years,
    };

    onChange(
      resetOnZero && Object.values(newDuration).every((val) => val === 0)
        ? undefined
        : JSON.stringify(newDuration),
    );
  };

  const handleReset = () => {
    onChange(undefined);
  };

  return (
    <TimeUnitPicker
      onUnitChange={handleOnUnitChange}
      onReset={!resetOnZero ? handleReset : () => undefined}
      years={parsedDuration?.years}
      months={parsedDuration?.months}
      days={parsedDuration?.days}
      hours={parsedDuration?.hours}
      minutes={parsedDuration?.minutes}
      seconds={parsedDuration?.seconds}
      showYears={showYears}
      showMonths={showMonths}
      showDays={showDays}
      showHours={showHours}
      showMinutes={showMinutes}
      showSeconds={showSeconds}
      textValue={parsedDuration?.textValue}
      className={cx('duration-picker', className)}
      position={position}
      disabled={disabled}
    />
  );
};
