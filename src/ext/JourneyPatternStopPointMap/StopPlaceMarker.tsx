import { StopPlace } from '../../api';
import { Button } from '@entur/button';
import { getMarkerIcon } from './markers';
import { Marker, Popup } from 'react-leaflet';
import { useIntl } from 'react-intl';
import { AddIcon } from '@entur/icons';
import StopPlaceDetails from './StopPlaceDetails';
import { MutableRefObject, useEffect, useRef } from 'react';
import { MapSearchResult } from './JourneyPatternStopPointMap';

interface StopPlaceMarkerProps {
  stopPlace: StopPlace;
  showQuaysCallback: () => void;
  addStopPointCallback: (quayRef: string) => void;
  isPopupToBeOpen: boolean;
  locatedSearchResult: MapSearchResult | undefined;
  clearLocateSearchResult: () => void;
}

export const getStopPlaceLocation = (stopPlace: StopPlace) => {
  return stopPlace.centroid && stopPlace.quays.length > 1
    ? stopPlace.centroid.location
    : stopPlace.quays[0].centroid.location;
};

const StopPlaceMarker = ({
  stopPlace,
  showQuaysCallback,
  addStopPointCallback,
  isPopupToBeOpen,
  locatedSearchResult,
  clearLocateSearchResult,
}: StopPlaceMarkerProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const stopPlaceLocation = getStopPlaceLocation(stopPlace);
  const markerRef: MutableRefObject<any> = useRef();

  useEffect(() => {
    if (isPopupToBeOpen && locatedSearchResult?.searchText.includes('Quay')) {
      // User actually searched for a quay, let's get into 'show quays mode'
      showQuaysCallback();
      return;
    }
    if (isPopupToBeOpen) {
      if (markerRef && markerRef.current) {
        markerRef.current.openPopup();
        // Mission accomplished, locateSearchResult can be cleared now
        clearLocateSearchResult();
      }
    }
  }, [
    isPopupToBeOpen,
    markerRef,
    clearLocateSearchResult,
    locatedSearchResult,
    showQuaysCallback,
    stopPlace,
  ]);

  return (
    <Marker
      key={'stop-place-marker-' + stopPlace.id}
      ref={markerRef}
      icon={getMarkerIcon(stopPlace.transportMode, true, false)}
      position={[stopPlaceLocation.latitude, stopPlaceLocation.longitude]}
    >
      <Popup>
        <StopPlaceDetails stopPlace={stopPlace} />

        {stopPlace.quays?.length > 1 ? (
          <Button
            className={'popup-button'}
            onClick={() => {
              showQuaysCallback();
            }}
            width="auto"
            variant="primary"
            size="small"
          >
            {formatMessage({ id: 'showQuays' })}
          </Button>
        ) : (
          <Button
            className={'popup-button'}
            onClick={() => {
              addStopPointCallback(stopPlace.quays[0].id);
              // When user selected a single quay, we still want to enter the "show quays" mode:
              showQuaysCallback();
            }}
            width="auto"
            variant="primary"
            size="small"
          >
            <AddIcon />
            {formatMessage({ id: 'addToJourneyPattern' })}
          </Button>
        )}
      </Popup>
    </Marker>
  );
};

export default StopPlaceMarker;
