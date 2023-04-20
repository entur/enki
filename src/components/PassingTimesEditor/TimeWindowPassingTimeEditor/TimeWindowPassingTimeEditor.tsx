import PassingTime from 'model/PassingTime';
import DayOffsetDropdown from 'components/DayOffsetDropdown';
import { useIntl } from 'react-intl';
import TimeWindowPassingTimeTitle from './TimeWindowPassingTimeTitle';
import StopPoint from 'model/StopPoint';
import { PassingTimePicker } from '../common/PassingTimePicker';

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
