import FlexibleStopPlace from 'model/FlexibleStopPlace';
import StopPoint from 'model/StopPoint';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

type Props = {
  stopPoint: StopPoint;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
};

const TimeWindowPassingTimeTitle = ({ stopPoint }: Props): ReactElement => {
  const { flexibleStopPlaces } = useSelector(
    ({ flexibleStopPlaces }: StateProps) => ({
      flexibleStopPlaces,
    })
  );

  return (
    <div className="title">
      {flexibleStopPlaces?.find(
        (stop) =>
          stop.id ===
          (stopPoint.flexibleStopPlaceRef ?? stopPoint.flexibleStopPlace?.id)
      )?.name ?? ''}
    </div>
  );
};

export default TimeWindowPassingTimeTitle;
