import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import formatDuration from 'date-fns/formatDuration';
import { nb } from 'date-fns/locale';
import * as durationLib from 'duration-fns';
import cx from 'classnames';

import TimeUnitPicker from '../TimeUnitPicker';

class DurationPicker extends React.Component {
  handleOnUnitChange(unit, value) {
    const duration = moment.duration(this.props.duration);
    const newDuration = moment.duration({
      seconds: unit === 'seconds' ? value : duration.seconds(),
      minutes: unit === 'minutes' ? value : duration.minutes(),
      hours: unit === 'hours' ? value : duration.hours(),
      days: unit === 'days' ? value : duration.days(),
      months: unit === 'months' ? value : duration.months(),
      years: unit === 'years' ? value : duration.years(),
    });
    this.props.onChange(
      this.props.resetOnZero && newDuration.asSeconds() === 0
        ? undefined
        : newDuration.toISOString()
    );
  }

  handleReset() {
    this.props.onChange(undefined);
  }

  render() {
    const {
      duration,
      resetOnZero,
      showSeconds,
      showMinutes,
      showHours,
      showMonths,
      showYears,
      showDays,
      position,
      className,
      disabled,
      intl,
    } = this.props;

    const parsedDuration = (() => {
      if (duration !== '') {
        const durationObj = durationLib.parse(duration);
        return {
          ...durationObj,
          textValue: formatDuration(durationObj, {
            locale: intl.locale === 'nb' && nb,
            delimiter: ', ',
          }),
        };
      } else {
        return undefined;
      }
    })();

    return (
      <TimeUnitPicker
        onUnitChange={this.handleOnUnitChange.bind(this)}
        onReset={!resetOnZero ? this.handleReset.bind(this) : () => undefined}
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
  }
}

DurationPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  duration: PropTypes.string,
  resetOnZero: PropTypes.bool,
  showYears: PropTypes.bool,
  showMonths: PropTypes.bool,
  showDays: PropTypes.bool,
  showSeconds: PropTypes.bool,
  showMinutes: PropTypes.bool,
  showHours: PropTypes.bool,
  position: PropTypes.oneOf(['above', 'below']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
DurationPicker.defaultProps = {
  duration: '',
  showSeconds: false,
  showMinutes: true,
  showHours: true,
  position: 'below',
  showYears: true,
  showMonths: true,
  showDays: true,
};

export default DurationPicker;
