import React, { useCallback, useEffect, useState } from 'react';
import { Radio, RadioGroup } from '@entur/form';
import PassingTime from 'model/PassingTime';
import { TimePicker } from '@entur/datepicker';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { ClockIcon } from '@entur/icons';
import { toDate } from './toDate';
import DayOffsetDropdown from 'components/DayOffsetDropdown';

enum PassingTimeType {
  NORMAL = 'normal',
  FLEXIBLE = 'flexible',
}

type Props = {
  passingTime: PassingTime;
  index: number;
  isLast: boolean;
  onChange: (passingTime: PassingTime) => void;
};

export const PassingTimeEditor = ({
  passingTime,
  index,
  isLast,
  onChange,
}: Props) => {
  const [type, setType] = useState(PassingTimeType.NORMAL);
  const { formatMessage } = useSelector(selectIntl);

  useEffect(() => {
    if (passingTime.arrivalTime) {
      setType(PassingTimeType.NORMAL);
      return;
    } else {
      setType(PassingTimeType.FLEXIBLE);
    }
  }, [passingTime]);

  const changeType = useCallback(
    (type: PassingTimeType) => {
      setType(type);

      if (type === PassingTimeType.NORMAL) {
        onChange({
          ...passingTime,
          arrivalTime: passingTime.latestArrivalTime,
          arrivalDayOffset: passingTime.latestArrivalDayOffset,
          departureTime: passingTime.earliestDepartureTime,
          departureDayOffset: passingTime.earliestDepartureDayOffset,
          latestArrivalTime: null,
          latestArrivalDayOffset: 0,
          earliestDepartureTime: null,
          earliestDepartureDayOffset: 0,
        });
      } else {
        onChange({
          ...passingTime,
          arrivalTime: null,
          arrivalDayOffset: 0,
          departureTime: null,
          departureDayOffset: 0,
          latestArrivalTime: passingTime.arrivalTime,
          latestArrivalDayOffset: passingTime.arrivalDayOffset,
          earliestDepartureTime: passingTime.departureTime,
          earliestDepartureDayOffset: passingTime.departureDayOffset,
        });
      }
    },
    [passingTime, onChange]
  );

  const arrivalField =
    type === PassingTimeType.NORMAL ? 'arrivalTime' : 'latestArrivalTime';
  const arrivalDayOffsetField =
    type === PassingTimeType.NORMAL
      ? 'arrivalDayOffset'
      : 'latestArrivalDayOffset';
  const arrivalLabel =
    type === PassingTimeType.NORMAL
      ? 'passingTimesArrivalTime'
      : 'passingTimesLatestArrivalTime';
  const departureField =
    type === PassingTimeType.NORMAL ? 'departureTime' : 'earliestDepartureTime';
  const departureDayOffsetField =
    type === PassingTimeType.NORMAL
      ? 'departureDayOffset'
      : 'earliestDepartureDayOffset';
  const departureLabel =
    type === PassingTimeType.NORMAL
      ? 'passingTimesDepartureTime'
      : 'passingTimesEarliestDepartureTime';

  return (
    <>
      <RadioGroup
        style={{ padding: '0 2rem' }}
        label=" "
        name={`passing-time-type-${index}`}
        onChange={(e) => changeType(e.target.value as PassingTimeType)}
        value={type}
      >
        <Radio value={PassingTimeType.NORMAL}>Vanlig</Radio>
        <Radio value={PassingTimeType.FLEXIBLE}>Fleksibel</Radio>
      </RadioGroup>
      <TimePicker
        disabled={index === 0 && type === PassingTimeType.NORMAL}
        label={formatMessage(arrivalLabel)}
        className="timepicker"
        onChange={(e: Date | null) => {
          const date = e?.toTimeString().split(' ')[0];
          onChange({
            ...passingTime,
            [arrivalField]: date,
            [departureField]:
              isLast && type === PassingTimeType.NORMAL
                ? date
                : passingTime.departureTime,
          });
        }}
        prepend={<ClockIcon inline />}
        selectedTime={toDate(passingTime[arrivalField]!)}
      />
      <DayOffsetDropdown
        value={passingTime[arrivalDayOffsetField] as number}
        disabled={index === 0 && type === PassingTimeType.NORMAL}
        onChange={(value) =>
          onChange({
            ...passingTime,
            [arrivalDayOffsetField]: value,
            [departureDayOffsetField]:
              isLast && type === PassingTimeType.NORMAL
                ? value
                : passingTime[departureDayOffsetField],
          })
        }
      />
      <TimePicker
        disabled={isLast && type === PassingTimeType.NORMAL}
        label={formatMessage(departureLabel)}
        className="timepicker"
        onChange={(e: Date | null) => {
          const date = e?.toTimeString().split(' ')[0];
          onChange({
            ...passingTime,
            [departureField]: date,
            [arrivalField]:
              index === 0 && type === PassingTimeType.NORMAL
                ? date
                : passingTime[arrivalField],
          });
        }}
        prepend={<ClockIcon inline />}
        selectedTime={toDate(passingTime[departureField]!)}
      />
      <DayOffsetDropdown
        value={passingTime[departureDayOffsetField] as number}
        disabled={isLast && type === PassingTimeType.NORMAL}
        onChange={(value) =>
          onChange({
            ...passingTime,
            [departureDayOffsetField]: value,
            [arrivalDayOffsetField]:
              index === 0 && type === PassingTimeType.NORMAL
                ? value
                : passingTime[departureDayOffsetField],
          })
        }
      />
    </>
  );
};
