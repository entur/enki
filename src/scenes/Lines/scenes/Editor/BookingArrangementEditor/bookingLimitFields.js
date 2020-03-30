import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Radio, RadioGroup, TextField } from '@entur/form';
import DurationPicker from 'components/DurationPicker';
import { selectIntl } from 'i18n';

const BOOKING_LIMIT_TYPE = Object.freeze({
  TIME: 'time',
  PERIOD: 'period',
});

export default (props) => {
  const { formatMessage } = useSelector(selectIntl);

  const {
    latestBookingTime,
    minimumBookingPeriod,
    onLatestBookingTimeChange,
    onMinimumBookingPeriodChange,
    resetBookingLimit,
  } = props;

  const [bookingLimitType, setBookingLimitType] = useState(
    latestBookingTime ? BOOKING_LIMIT_TYPE.TIME : BOOKING_LIMIT_TYPE.PERIOD
  );

  const handleBookingLimitChange = useCallback(
    (type) => {
      setBookingLimitType(type);
      resetBookingLimit();
    },
    [resetBookingLimit]
  );

  return (
    <div className="form-section">
      <RadioGroup
        label={formatMessage('bookingLimitFieldsHeaderLabel')}
        onChange={(e) => handleBookingLimitChange(e.target.value)}
        value={bookingLimitType}
      >
        <Radio className="booking-limit-radio" value={BOOKING_LIMIT_TYPE.TIME}>
          {formatMessage(
            'bookingLimitFieldsBookingLimitTypeTimeRadioButtonLabel'
          )}
        </Radio>
        <TextField
          type="time"
          className="latest-time-picker"
          defaultValue={latestBookingTime || undefined}
          onChange={(e) => onLatestBookingTimeChange(e.target.value)}
          disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.TIME}
        />

        <Radio
          className="booking-limit-radio"
          value={BOOKING_LIMIT_TYPE.PERIOD}
        >
          {formatMessage(
            'bookingLimitFieldsBookingLimitTypePeriodRadioButtonLabel'
          )}
        </Radio>

        <DurationPicker
          className="mimimum-booking-period-picker"
          duration={minimumBookingPeriod}
          resetOnZero
          onChange={(period) => onMinimumBookingPeriodChange(period)}
          disabled={bookingLimitType !== BOOKING_LIMIT_TYPE.PERIOD}
          position="above"
          showYears={false}
          showMonths={false}
        />
      </RadioGroup>
    </div>
  );
};
