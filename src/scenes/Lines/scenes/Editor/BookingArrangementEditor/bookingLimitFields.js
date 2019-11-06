import React, {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {
  Label,
  TextField,
  Radio,
} from '@entur/component-library';
import DurationPicker from '../../../../../components/DurationPicker';
import {selectIntl} from '../../../../../i18n';
import messages from './bookingLimitFields.messages';

const BOOKING_LIMIT_TYPE = Object.freeze({
  TIME: 'time',
  PERIOD: 'period'
});

export default (props) => {
  const {formatMessage} = useSelector(selectIntl);

  const {
    latestBookingTime,
    minimumBookingPeriod,
    onLatestBookingTimeChange,
    onMinimumBookingPeriodChange,
    resetBookingLimit
  } = props;

  const [bookingLimitType, setBookingLimitType] = useState(
    latestBookingTime ? BOOKING_LIMIT_TYPE.TIME : BOOKING_LIMIT_TYPE.PERIOD
  );

  const handleBookingLimitChange = useCallback(type => {
    setBookingLimitType(type);
    resetBookingLimit();
  }, [resetBookingLimit]);

  return (
    <div className="form-section">
      <Label>{formatMessage(messages.headerLabel)}</Label>

      <Radio
        className="booking-limit-radio"
        label={formatMessage(messages.bookingLimitTypeTimeRadioButtonLabel)}
        value={BOOKING_LIMIT_TYPE.TIME}
        checked={bookingLimitType === BOOKING_LIMIT_TYPE.TIME}
        onChange={() => handleBookingLimitChange(BOOKING_LIMIT_TYPE.TIME)}
      />
      <TextField
        type="time"
        className="latest-time-picker"
        value={latestBookingTime}
        onChange={e => onLatestBookingTimeChange(e.target.value)}
        disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.TIME}
      />

      <Radio
        className="booking-limit-radio"
        label={formatMessage(messages.bookingLimitTypePeriodRadioButtonLabel)}
        value={BOOKING_LIMIT_TYPE.PERIOD}
        checked={bookingLimitType === BOOKING_LIMIT_TYPE.PERIOD}
        onChange={() => handleBookingLimitChange(BOOKING_LIMIT_TYPE.PERIOD)}
      />

      <DurationPicker
        className="mimimum-booking-period-picker"
        duration={minimumBookingPeriod}
        resetOnZero
        onChange={period => onMinimumBookingPeriodChange(period)}
        disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.PERIOD}
        position="above"
        showYears={false}
        showMonths={false}
      />
    </div>
  );
}
