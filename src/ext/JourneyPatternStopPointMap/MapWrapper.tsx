import './styles.scss';
import FormMap from '../../components/FormMap';
import JourneyPatternStopPointMap from './JourneyPatternStopPointMap';
import { MapWrapperProps } from './types';
import { useStopPlacesData } from './hooks';
import Loading from '../../components/Loading';
import React from 'react';
import { useIntl } from 'react-intl';

export const MapWrapper = ({
  pointsInSequence,
  addStopPoint,
  deleteStopPoint,
  transportMode,
}: MapWrapperProps) => {
  // Fetching stop places data and the indexes:
  const { stopPlacesState, isLoading } = useStopPlacesData(transportMode);
  const { formatMessage } = useIntl();

  return (
    <FormMap zoomControl={false} doubleClickZoom={false}>
      {!isLoading ? (
        <JourneyPatternStopPointMap
          stopPlacesState={stopPlacesState}
          transportMode={transportMode}
          pointsInSequence={pointsInSequence}
          deleteStopPoint={deleteStopPoint}
          addStopPoint={addStopPoint}
        />
      ) : (
        <div className="stop-places-spinner">
          <Loading
            isFullScreen={false}
            text={formatMessage({ id: 'mapLoadingStopsDataText' })}
            isLoading={isLoading}
            children={null}
            className=""
          />
        </div>
      )}
    </FormMap>
  );
};
