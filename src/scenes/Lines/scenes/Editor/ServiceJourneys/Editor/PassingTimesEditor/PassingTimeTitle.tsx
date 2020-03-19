import FlexibleStopPlace from 'model/FlexibleStopPlace';
import StopPoint from 'model/StopPoint';
import React, { ReactElement, useEffect, useState } from 'react';
import searchForQuay from 'scenes/Lines/scenes/Editor/JourneyPatterns/Editor/StopPoints/Editor/searchForQuay';

type Props = {
  flexibleStopPlaces: FlexibleStopPlace[];
  stopPoint: StopPoint;
};

const PassingTimeTitle = ({
  flexibleStopPlaces,
  stopPoint
}: Props): ReactElement => {
  const quayRef = stopPoint.quayRef;
  const [title, setTitle] = useState(quayRef);

  useEffect(() => {
    if (quayRef) {
      const fetchTitle = async () =>
        await searchForQuay(quayRef).then(response =>
          setTitle(response.stopPlace?.name.value ?? quayRef)
        );
      fetchTitle();
    }
  }, [quayRef]);

  return (
    <div className="title">
      {quayRef
        ? title
        : flexibleStopPlaces?.find(
            stop =>
              stop.id ===
              (stopPoint.flexibleStopPlace?.id ??
                stopPoint.flexibleStopPlaceRef)
          )?.name ?? ''}
    </div>
  );
};

export default PassingTimeTitle;
