import React, { useCallback, useState } from 'react';
import { Radio, RadioGroup } from '@entur/form';
import PassingTime from 'model/PassingTime';
import { TimePicker } from '@entur/datepicker';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
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
  showFlexible: boolean;
};

export const PassingTimeEditor = ({
  passingTime,
  index,
  isLast,
  onChange,
  showFlexible,
}: Props) => {
  const [type, setType] = useState(
    passingTime.latestArrivalTime || passingTime.earliestDepartureTime
      ? PassingTimeType.FLEXIBLE
      : PassingTimeType.NORMAL
  );
  const { formatMessage } = useSelector(selectIntl);

  const changeType = useCallback(
    (type: PassingTimeType) => {
      setType(type);

      if (type === PassingTimeType.NORMAL) {
        onChange({
          ...passingTime,
          arrivalTime: passingTime.earliestDepartureTime,
          arrivalDayOffset: passingTime.earliestDepartureDayOffset,
          departureTime: passingTime.latestArrivalTime,
          departureDayOffset: passingTime.latestArrivalDayOffset,
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
          latestArrivalTime: passingTime.departureTime,
          latestArrivalDayOffset: passingTime.departureDayOffset,
          earliestDepartureTime: passingTime.arrivalTime,
          earliestDepartureDayOffset: passingTime.arrivalDayOffset,
        });
      }
    },
    [passingTime, onChange]
  );

  const arrivalField =
    type === PassingTimeType.NORMAL ? 'arrivalTime' : 'earliestDepartureTime';
  const arrivalDayOffsetField =
    type === PassingTimeType.NORMAL
      ? 'arrivalDayOffset'
      : 'earliestDepartureDayOffset';
  const arrivalLabel =
    type === PassingTimeType.NORMAL
      ? 'passingTimesArrivalTime'
      : 'passingTimesEarliestDepartureTime';
  const departureField =
    type === PassingTimeType.NORMAL ? 'departureTime' : 'latestArrivalTime';
  const departureDayOffsetField =
    type === PassingTimeType.NORMAL
      ? 'departureDayOffset'
      : 'latestArrivalDayOffset';
  const departureLabel =
    type === PassingTimeType.NORMAL
      ? 'passingTimesDepartureTime'
      : 'passingTimesLatestArrivalTime';

  return (
    <>
      {showFlexible && (
        <RadioGroup
          style={{ padding: '0 2rem' }}
          label=" "
          name={`passing-time-type-${index}`}
          onChange={(e) => changeType(e.target.value as PassingTimeType)}
          value={type}
        >
          <Radio value={PassingTimeType.NORMAL}>
            {formatMessage('passingTimesTypeFixed')}
          </Radio>
          <Radio value={PassingTimeType.FLEXIBLE}>
            {formatMessage('passingTimesTypeFlexible')}
          </Radio>
        </RadioGroup>
      )}

      <TimePicker
        disabled={index === 0 && type === PassingTimeType.NORMAL}
        label={`${formatMessage(arrivalLabel)}${isLast ? ' *' : ''}`}
        className="timepicker"
        onChange={(e: Date | null) => {
          const date = e?.toTimeString().split(' ')[0];
          onChange({
            ...passingTime,
            [arrivalField]: date || null,
            [departureField]:
              isLast && type === PassingTimeType.NORMAL
                ? null
                : passingTime[departureField],
          });
        }}
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
                ? null
                : passingTime[departureDayOffsetField],
          })
        }
      />
      <TimePicker
        disabled={isLast && type === PassingTimeType.NORMAL}
        label={`${formatMessage(departureLabel)}${index === 0 ? ' *' : ''}`}
        className="timepicker"
        onChange={(e: Date | null) => {
          const date = e?.toTimeString().split(' ')[0];
          onChange({
            ...passingTime,
            [departureField]: date || null,
            [arrivalField]:
              index === 0 && type === PassingTimeType.NORMAL
                ? null
                : passingTime[arrivalField],
          });
        }}
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
                ? null
                : passingTime[departureDayOffsetField],
          })
        }
      />
    </>
  );
};
