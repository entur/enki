import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import propTypes from 'prop-types';
import cx from 'classnames';
import { Label } from '@entur/component-library';

import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import './styles.css';

class CustomDatepicker extends Component {
  handleDateChange(date) {
    const { onChange, showTimeSelect } = this.props;
    onChange(moment(date).format(showTimeSelect ? '' : 'YYYY-MM-DD'));
  }

  render() {
    const {
      startDate,
      showTimePicker,
      timeIntervals,
      label,
      className
    } = this.props;
    const classNames = cx('datepicker', className);
    const selectedDate = moment(startDate);
    return (
      <div className={classNames}>
        {label && <Label>{label}</Label>}
        <DatePicker
          selected={selectedDate}
          onChange={::this.handleDateChange}
          onChangeRaw={e => this.handleDateChange(e.target.value)}
          showTimeSelect={showTimePicker}
          timeIntervals={timeIntervals}
          showYearDropdown
          shouldCloseOnSelect
          timeFormat="HH:mm"
          dateFormat="DD.MM.YYYY"
          className="custom-datepicker"
          calendarClassName="custom-datepicker-calendar"
        />
      </div>
    );
  }
}

CustomDatepicker.propTypes = {
  startDate: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  label: propTypes.string,
  showTimePicker: propTypes.bool,
  timeIntervals: propTypes.number
};
CustomDatepicker.defaultProps = {
  timeIntervals: 15
};

export default CustomDatepicker;
