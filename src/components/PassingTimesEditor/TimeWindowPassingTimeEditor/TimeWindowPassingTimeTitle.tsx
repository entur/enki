import FlexibleStopPlace from 'model/FlexibleStopPlace';
import StopPoint from 'model/StopPoint';
import { ReactElement } from 'react';
import { useAppSelector } from '../../../store/hooks';

type Props = {
  stopPoint: StopPoint;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
};

const TimeWindowPassingTimeTitle = ({ stopPoint }: Props): ReactElement => {
  const flexibleStopPlaces = useAppSelector(
    (state) => state.flexibleStopPlaces,
  );

  return (
    <div className="title">
      {flexibleStopPlaces?.find(
        (stop) =>
          stop.id ===
          (stopPoint.flexibleStopPlaceRef ?? stopPoint.flexibleStopPlace?.id),
      )?.name ?? ''}
    </div>
  );
};

export default TimeWindowPassingTimeTitle;
