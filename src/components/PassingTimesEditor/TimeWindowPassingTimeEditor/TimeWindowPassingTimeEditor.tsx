import React from 'react';
import PassingTime from 'model/PassingTime';
import { TimePicker } from '@entur/datepicker';
import DayOffsetDropdown from 'components/DayOffsetDropdown';
import { ClockIcon } from '@entur/icons';
import { useIntl } from 'i18n';
import { toDate } from '../common/toDate';
import TimeWindowPassingTimeTitle from './TimeWindowPassingTimeTitle';
import StopPoint from 'model/StopPoint';

type Props = {
  passingTime: PassingTime;
  stopPoint: StopPoint;
  onChange: (passingTime: PassingTime) => void;
};

export const FlexibleAreasOnlyPassingTimeEditor = ({
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
        onChange={(e: Date | null) => {
          const date = e?.toTimeString().split(' ')[0];
          onChange({
            ...passingTime,
            earliestDepartureTime: date || null,
          });
        }}
        prepend={<ClockIcon inline />}
        selectedTime={toDate(passingTime.earliestDepartureTime!)}
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
        onChange={(e: Date | null) => {
          const date = e?.toTimeString().split(' ')[0];
          onChange({
            ...passingTime,
            latestArrivalTime: date || null,
          });
        }}
        prepend={<ClockIcon inline />}
        selectedTime={toDate(passingTime.latestArrivalTime!)}
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
