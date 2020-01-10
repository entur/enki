import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import propTypes from 'prop-types';
import cx from 'classnames';
import { Label } from '@entur/component-library';

import './styles.css';
import 'react-datepicker/dist/react-datepicker.css';

class CustomDatepicker extends Component {
  handleDateChange(date) {
    const { onChange, showTimeSelect } = this.props;
    const newDate = date
      ? moment(date).format(showTimeSelect ? '' : 'YYYY-MM-DD')
      : undefined;
    onChange(newDate);
  }

  render() {
    const {
      startDate,
      showTimePicker,
      timeIntervals,
      label,
      disabled,
      className,
      datePickerClassName
    } = this.props;
    const classNames = cx('datepicker', className);
    const datePickerClassNames = cx('custom-datepicker', datePickerClassName);
    const selectedDate = startDate !== null ? moment(startDate) : null;
    return (
      <div className={classNames}>
        {label && <Label>{label}</Label>}
        <DatePicker
          selected={selectedDate}
          onChange={this.handleDateChange.bind(this)}
          onChangeRaw={e => this.handleDateChange(e.target.value)}
          showTimeSelect={showTimePicker}
          timeIntervals={timeIntervals}
          showYearDropdown
          shouldCloseOnSelect
          timeFormat="HH:mm"
          dateFormat="DD.MM.YYYY"
          className={datePickerClassNames}
          calendarClassName="custom-datepicker-calendar"
          disabled={disabled}
        />
      </div>
    );
  }
}

CustomDatepicker.propTypes = {
  onChange: propTypes.func.isRequired,
  startDate: propTypes.string,
  label: propTypes.string,
  showTimePicker: propTypes.bool,
  timeIntervals: propTypes.number,
  disabled: propTypes.bool
};
CustomDatepicker.defaultProps = {
  timeIntervals: 15
};

export default CustomDatepicker;
