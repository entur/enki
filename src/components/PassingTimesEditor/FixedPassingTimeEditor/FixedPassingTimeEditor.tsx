import DayOffsetDropdown from 'components/DayOffsetDropdown';
import PassingTime from 'model/PassingTime';
import StopPoint from 'model/StopPoint';
import { useIntl } from 'react-intl';
import { PassingTimePicker } from '../common/PassingTimePicker';
import FixedPassingTimeTitle from './FixedPassingTimeTitle';

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
        label={formatMessage({ id: 'passingTimesArrivalTime' })}
        disabled={index === 0}
        required={isLast}
        selectedTime={passingTime.arrivalTime}
        onChange={(arrivalTime: string | null) => {
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
        label={formatMessage({ id: 'passingTimesDepartureTime' })}
        disabled={isLast}
        required={index === 0}
        selectedTime={passingTime.departureTime}
        onChange={(departureTime: string | null) => {
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
