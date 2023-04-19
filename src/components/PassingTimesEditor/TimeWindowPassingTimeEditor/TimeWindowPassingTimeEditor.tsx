import PassingTime from 'model/PassingTime';
import DayOffsetDropdown from 'components/DayOffsetDropdown';
import { useIntl } from 'i18n';
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
        label={formatMessage('passingTimesEarliestDepartureTime')}
        required
        selectedTime={passingTime.earliestDepartureTime}
        onChange={(earliestDepartureTime: string) => {
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
        label={formatMessage('passingTimesLatestArrivalTime')}
        required
        selectedTime={passingTime.latestArrivalTime}
        onChange={(latestArrivalTime: string) => {
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
