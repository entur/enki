import PassingTime from 'model/PassingTime';
import StopPoint from 'model/StopPoint';
import { FixedPassingTimeEditor } from '../FixedPassingTimeEditor/FixedPassingTimeEditor';
import { TimeWindowPassingTimeEditor } from '../TimeWindowPassingTimeEditor/TimeWindowPassingTimeEditor';

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
  const type = stopPoint.quayRef
    ? PassingTimeType.FIXED
    : PassingTimeType.TIME_WINDOW;

  return (
    <>
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
        <TimeWindowPassingTimeEditor
          passingTime={passingTime}
          stopPoint={stopPoint}
          onChange={onChange}
        />
      )}
    </>
  );
};
