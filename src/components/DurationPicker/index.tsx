import React from 'react';
import moment from 'moment';
import formatDuration from 'date-fns/formatDuration';
import { nb } from 'date-fns/locale';
import * as durationLib from 'duration-fns';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { selectIntl, AppIntlState } from 'i18n';
import TimeUnitPicker from '../TimeUnitPicker';
import { GlobalState } from 'reducers';

export enum DurationPickerPosition {
  ABOVE = 'above',
  BELOW = 'below',
}

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
  position?: DurationPickerPosition;
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
    position = DurationPickerPosition.ABOVE,
    className,
    disabled = false,
  } = props;

  const intl = useSelector<GlobalState, AppIntlState>(selectIntl);

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
      intl={intl}
    />
  );
};
