import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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
    } = this.props;

    const d = moment.duration(duration);
    const seconds = d.seconds();
    const minutes = d.minutes();
    const hours = d.hours();
    const days = d.days();
    const months = d.months();
    const years = d.years();

    const textValue = () => {
      const values = [];
      if (years !== 0) {
        values.push(years + ' år');
      }
      if (months !== 0) {
        values.push(months + ' måned' + (months > 1 ? 'er' : ''));
      }
      if (days !== 0) {
        values.push(days + ' dag' + (days > 1 ? 'er' : ''));
      }
      if (hours !== 0) {
        values.push(hours + ' time' + (hours > 1 ? 'r' : ''));
      }
      if (minutes !== 0) {
        values.push(minutes + ' minutt' + (minutes > 1 ? 'er' : ''));
      }
      if (seconds !== 0) {
        values.push(seconds + ' sekund' + (seconds > 1 ? 'er' : ''));
      }
      if (values.length === 0) {
        return '';
      }
      if (values.length === 1) {
        return values[0];
      }
      return values
        .map((value, i) => {
          if (i < values.length - 2) {
            return value + ', ';
          } else if (i === values.length - 2) {
            return value + ' og ';
          }
          return value;
        })
        .join('');
    };

    return (
      <TimeUnitPicker
        onUnitChange={this.handleOnUnitChange.bind(this)}
        onReset={!resetOnZero ? this.handleReset.bind(this) : () => undefined}
        years={years}
        months={months}
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        showYears={showYears}
        showMonths={showMonths}
        showDays={showDays}
        showHours={showHours}
        showMinutes={showMinutes}
        showSeconds={showSeconds}
        textValue={textValue()}
        className={cx('duration-picker', className)}
        position={position}
        disabled={disabled}
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
