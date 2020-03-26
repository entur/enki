import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';

import TimeUnitPicker from '../TimeUnitPicker';

class TimePicker extends React.Component {
  handleOnUnitChange(field, value) {
    const time = moment(
      this.props.time ? this.props.time : '00:00:00',
      moment.HTML5_FMT.TIME_SECONDS
    );
    time.set(field, value);
    this.props.onChange(time.format(moment.HTML5_FMT.TIME_SECONDS));
  }

  handleReset() {
    this.props.onChange(undefined);
  }

  render() {
    const {
      label,
      time,
      defaultTime,
      showSeconds,
      position,
      className,
    } = this.props;

    const t = moment(time || '00:00:00', moment.HTML5_FMT.TIME_SECONDS);
    const seconds = t.seconds();
    const minutes = t.minutes();
    const hours = t.hours();

    let textValue;
    if (time) {
      textValue = showSeconds ? time : t.format(moment.HTML5_FMT.TIME);
    } else {
      textValue = defaultTime;
    }

    return (
      <TimeUnitPicker
        onUnitChange={this.handleOnUnitChange.bind(this)}
        onReset={this.handleReset.bind(this)}
        label={label}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        showYears={false}
        showMonths={false}
        showDays={false}
        showHours={true}
        showMinutes={true}
        showSeconds={showSeconds}
        textValue={textValue}
        className={cx(
          'time-picker',
          { 'with-seconds': showSeconds },
          className
        )}
        position={position}
      />
    );
  }
}

TimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  time: PropTypes.string,
  defaultTime: PropTypes.string,
  showSeconds: PropTypes.bool,
  position: PropTypes.oneOf(['above', 'below']),
  className: PropTypes.string,
};

TimePicker.defaultProps = {
  defaultTime: '--:--:--',
  showSeconds: true,
  position: 'below',
};

export default TimePicker;
