import { useQuaySearch } from 'api/useQuaySearch';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import StopPoint from 'model/StopPoint';
import React, { ReactElement } from 'react';

type Props = {
  flexibleStopPlaces: FlexibleStopPlace[];
  stopPoint: StopPoint;
};

const PassingTimeTitle = ({
  flexibleStopPlaces,
  stopPoint,
}: Props): ReactElement => {
  const quayRef = stopPoint.quayRef;
  const { stopPlace } = useQuaySearch(quayRef);

  return (
    <div className="title">
      {quayRef
        ? stopPlace?.name.value ?? quayRef
        : flexibleStopPlaces?.find(
            (stop) =>
              stop.id ===
              (stopPoint.flexibleStopPlaceRef ??
                stopPoint.flexibleStopPlace?.id)
          )?.name ?? ''}
    </div>
  );
};

export default PassingTimeTitle;
