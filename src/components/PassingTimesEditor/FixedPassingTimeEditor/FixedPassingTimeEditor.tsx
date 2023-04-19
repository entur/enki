import PassingTime from 'model/PassingTime';
import DayOffsetDropdown from 'components/DayOffsetDropdown';
import { useIntl } from 'i18n';
import FixedPassingTimeTitle from './FixedPassingTimeTitle';
import StopPoint from 'model/StopPoint';
import { PassingTimePicker } from '../common/PassingTimePicker';

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
      <PassingTimePicker
        label={formatMessage('passingTimesArrivalTime')}
        disabled={index === 0}
        required={isLast}
        selectedTime={passingTime.arrivalTime}
        onChange={(arrivalTime: string) => {
          onChange({
            ...passingTime,
            arrivalTime,
            departureTime: isLast ? null : passingTime.departureTime,
          });
        }}
      />
      <DayOffsetDropdown
        value={
          index === 0 ? undefined : (passingTime.arrivalDayOffset as number)
        }
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
      <PassingTimePicker
        label={formatMessage('passingTimesDepartureTime')}
        disabled={isLast}
        required={index === 0}
        selectedTime={passingTime.departureTime}
        onChange={(departureTime: string) => {
          onChange({
            ...passingTime,
            departureTime,
            arrivalTime: index === 0 ? null : passingTime.arrivalTime,
          });
        }}
      />
      <DayOffsetDropdown
        value={isLast ? undefined : (passingTime.departureDayOffset as number)}
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
