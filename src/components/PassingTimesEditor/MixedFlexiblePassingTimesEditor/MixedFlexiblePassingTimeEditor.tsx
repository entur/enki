import { Radio, RadioGroup } from '@entur/form';
import { selectIntl } from 'i18n';
import PassingTime from 'model/PassingTime';
import StopPoint from 'model/StopPoint';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { FlexibleAreasOnlyPassingTimeEditor } from '../TimeWindowPassingTimeEditor/TimeWindowPassingTimeEditor';
import { FixedPassingTimeEditor } from '../FixedPassingTimeEditor/FixedPassingTimeEditor';

type Props = {
  passingTime: PassingTime;
  stopPoint: StopPoint;
  index: number;
  isLast: boolean;
  onChange: (passingTime: PassingTime) => void;
};

enum PassingTimeType {
  FIXED = 'fixed',
  TIME_WINDOW = 'time_window',
}

export const MixedFlexiblePassingTimeEditor = ({
  passingTime,
  stopPoint,
  index,
  isLast,
  onChange,
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const [type, setType] = useState(
    passingTime.latestArrivalTime || passingTime.earliestDepartureTime
      ? PassingTimeType.TIME_WINDOW
      : PassingTimeType.FIXED
  );

  const changeType = useCallback(
    (type: PassingTimeType) => {
      setType(type);

      if (type === PassingTimeType.FIXED) {
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

  return (
    <>
      <RadioGroup
        style={{ padding: '0 2rem' }}
        label=" "
        name={`passing-time-type-${index}`}
        onChange={(e) => changeType(e.target.value as PassingTimeType)}
        value={type}
      >
        <Radio value={PassingTimeType.FIXED}>
          {formatMessage('passingTimesTypeFixed')}
        </Radio>
        <Radio value={PassingTimeType.TIME_WINDOW}>
          {formatMessage('passingTimesTypeFlexible')}
        </Radio>
      </RadioGroup>
      {type === PassingTimeType.FIXED && (
        <FixedPassingTimeEditor
          passingTime={passingTime}
          stopPoint={stopPoint}
          index={index}
          isLast={isLast}
          onChange={onChange}
        />
      )}
      {type === PassingTimeType.TIME_WINDOW && (
        <FlexibleAreasOnlyPassingTimeEditor
          passingTime={passingTime}
          stopPoint={stopPoint}
          onChange={onChange}
        />
      )}
    </>
  );
};
