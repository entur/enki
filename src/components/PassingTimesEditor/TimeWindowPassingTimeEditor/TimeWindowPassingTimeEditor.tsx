import DayOffsetDropdown from 'components/DayOffsetDropdown';
import PassingTime from 'model/PassingTime';
import StopPoint from 'model/StopPoint';
import { useIntl } from 'react-intl';
import { PassingTimePicker } from '../common/PassingTimePicker';
import TimeWindowPassingTimeTitle from './TimeWindowPassingTimeTitle';

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
      <PassingTimePicker
        label={formatMessage({ id: 'passingTimesEarliestDepartureTime' })}
        required
        selectedTime={passingTime.earliestDepartureTime}
        onChange={(earliestDepartureTime: string | null) => {
          onChange({
            ...passingTime,
            earliestDepartureTime,
          });
        }}
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
      <PassingTimePicker
        label={formatMessage({ id: 'passingTimesLatestArrivalTime' })}
        required
        selectedTime={passingTime.latestArrivalTime}
        onChange={(latestArrivalTime: string | null) => {
          onChange({
            ...passingTime,
            latestArrivalTime,
          });
        }}
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
