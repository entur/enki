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
import FixedPassingTimeTitle from './FixedPassingTimeTitle';
import StopPoint from 'model/StopPoint';
import { TimeValue } from '@react-types/datepicker';

type Props = {
  passingTime: PassingTime;
  stopPoint: StopPoint;
  index: number;
  isLast: boolean;
  onChange: (passingTime: PassingTime) => void;
};

export const FixedPassingTimeEditor = ({
  passingTime,
  stopPoint,
  index,
  isLast,
  onChange,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <FixedPassingTimeTitle stopPoint={stopPoint} />
      <TimePicker
        disabled={index === 0}
        label={`${formatMessage('passingTimesArrivalTime')}${
          isLast ? ' *' : ''
        }`}
        className="timepicker"
        onChange={(e: TimeValue) => {
          const date = timeOrDateValueToNativeDate(e)
            ?.toTimeString()
            .split(' ')[0];
          onChange({
            ...passingTime,
            arrivalTime: date || null,
            departureTime: isLast ? null : passingTime.departureTime,
          });
        }}
        selectedTime={
          nativeDateToTimeOrDateValue(
            toDate(passingTime.arrivalTime!)!
          ) as TimeValue
        }
      />
      <DayOffsetDropdown
        value={passingTime.arrivalDayOffset as number}
        disabled={index === 0}
        onChange={(value) =>
          onChange({
            ...passingTime,
            arrivalDayOffset: value,
            departureDayOffset: isLast
              ? undefined
              : passingTime.departureDayOffset,
          })
        }
      />
      <TimePicker
        disabled={isLast}
        label={`${formatMessage('passingTimesDepartureTime')}${
          index === 0 ? ' *' : ''
        }`}
        className="timepicker"
        onChange={(e: TimeValue) => {
          const date = timeOrDateValueToNativeDate(e)
            ?.toTimeString()
            .split(' ')[0];
          onChange({
            ...passingTime,
            departureTime: date || null,
            arrivalTime: index === 0 ? null : passingTime.arrivalTime,
          });
        }}
        selectedTime={
          nativeDateToTimeOrDateValue(
            toDate(passingTime.departureTime!)!
          ) as TimeValue
        }
      />
      <DayOffsetDropdown
        value={passingTime.departureDayOffset as number}
        disabled={isLast}
        onChange={(value) =>
          onChange({
            ...passingTime,
            departureDayOffset: value,
            arrivalDayOffset:
              index === 0 ? undefined : passingTime.departureDayOffset,
          })
        }
      />
    </>
  );
};
