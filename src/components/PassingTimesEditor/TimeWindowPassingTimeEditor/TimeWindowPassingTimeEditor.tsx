import React from 'react';
import PassingTime from 'model/PassingTime';
import {
  nativeDateToTimeOrDateValue,
  timeOrDateValueToNativeDate,
  TimePicker,
} from '@entur/datepicker';
import DayOffsetDropdown from 'components/DayOffsetDropdown';
import { ClockIcon } from '@entur/icons';
import { useIntl } from 'i18n';
import { toDate } from '../common/toDate';
import TimeWindowPassingTimeTitle from './TimeWindowPassingTimeTitle';
import StopPoint from 'model/StopPoint';
import { TimeValue } from '@react-types/datepicker';

type Props = {
  passingTime: PassingTime;
  stopPoint: StopPoint;
  onChange: (passingTime: PassingTime) => void;
};

export const TimeWindowPassingTimeEditor = ({
  passingTime,
  stopPoint,
  onChange,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <TimeWindowPassingTimeTitle stopPoint={stopPoint} />
      <TimePicker
        label={`${formatMessage('passingTimesEarliestDepartureTime')}${' *'}`}
        className="timepicker"
        onChange={(e: TimeValue) => {
          const date = timeOrDateValueToNativeDate(e)
            ?.toTimeString()
            .split(' ')[0];
          onChange({
            ...passingTime,
            earliestDepartureTime: date || null,
          });
        }}
        selectedTime={
          nativeDateToTimeOrDateValue(
            toDate(passingTime.earliestDepartureTime!)!
          ) as TimeValue
        }
      />
      <DayOffsetDropdown
        value={passingTime.earliestDepartureDayOffset as number}
        onChange={(value) => {
          onChange({
            ...passingTime,
            earliestDepartureDayOffset: value,
          });
        }}
      />
      <TimePicker
        label={`${formatMessage('passingTimesLatestArrivalTime')}${' *'}`}
        className="timepicker"
        onChange={(e: TimeValue) => {
          const date = timeOrDateValueToNativeDate(e)
            ?.toTimeString()
            .split(' ')[0];
          onChange({
            ...passingTime,
            latestArrivalTime: date || null,
          });
        }}
        selectedTime={
          nativeDateToTimeOrDateValue(
            toDate(passingTime.latestArrivalTime!)!
          ) as TimeValue
        }
      />
      <DayOffsetDropdown
        value={passingTime.latestArrivalDayOffset as number}
        onChange={(value) => {
          onChange({
            ...passingTime,
            latestArrivalDayOffset: value,
          });
        }}
      />
    </>
  );
};
