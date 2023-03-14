import React from 'react';
import PassingTime from 'model/PassingTime';
import { TimePicker } from '@entur/datepicker';
import DayOffsetDropdown from 'components/DayOffsetDropdown';
import { ClockIcon } from '@entur/icons';
import { useIntl } from 'i18n';
import { toDate } from '../common/toDate';

type Props = {
  passingTime: PassingTime;
  index: number;
  isLast: boolean;
  onChange: (passingTime: PassingTime) => void;
};

export const GenericPassingTimeEditor = ({
  passingTime,
  index,
  isLast,
  onChange,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <TimePicker
        disabled={index === 0}
        label={`${formatMessage('passingTimesArrivalTime')}${
          isLast ? ' *' : ''
        }`}
        className="timepicker"
        onChange={(e: Date | null) => {
          const date = e?.toTimeString().split(' ')[0];
          onChange({
            ...passingTime,
            arrivalTime: date || null,
            departureTime: isLast ? null : passingTime.departureTime,
          });
        }}
        prepend={<ClockIcon inline />}
        selectedTime={toDate(passingTime.arrivalTime!)}
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
        onChange={(e: Date | null) => {
          const date = e?.toTimeString().split(' ')[0];
          onChange({
            ...passingTime,
            departureTime: date || null,
            arrivalTime: index === 0 ? null : passingTime.arrivalTime,
          });
        }}
        prepend={<ClockIcon inline />}
        selectedTime={toDate(passingTime.departureTime!)}
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
