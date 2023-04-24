import cx from 'classnames';
import formatDuration from 'date-fns/formatDuration';
import { nb } from 'date-fns/locale';
import * as durationLib from 'duration-fns';
import moment from 'moment';
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
        textValue: formatDuration(durationObj, {
          locale: intl.locale === 'nb' ? nb : undefined,
          delimiter: ', ',
        }),
      };
    } else {
      return undefined;
    }
  })();

  const handleOnUnitChange = (unit: string, value: number) => {
    const newDuration = moment.duration({
      seconds: unit === 'seconds' ? value : parsedDuration?.seconds,
      minutes: unit === 'minutes' ? value : parsedDuration?.minutes,
      hours: unit === 'hours' ? value : parsedDuration?.hours,
      days: unit === 'days' ? value : parsedDuration?.days,
      months: unit === 'months' ? value : parsedDuration?.months,
      years: unit === 'years' ? value : parsedDuration?.years,
    });

    onChange(
      resetOnZero && newDuration.asSeconds() === 0
        ? undefined
        : newDuration.toISOString()
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
