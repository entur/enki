import { StopPlace } from '../../api';
import { Button } from '@entur/button';
import { getMarkerIcon } from './markers';
import { Marker, Popup } from 'react-leaflet';
import { useIntl } from 'react-intl';
import { AddIcon } from '@entur/icons';
import StopPlaceDetails from './StopPlaceDetails';
import { MutableRefObject, useEffect, useRef } from 'react';
import { FocusedMarker } from './JourneyPatternStopPointMap';

interface StopPlaceMarkerProps {
  stopPlace: StopPlace;
  showQuaysCallback: () => void;
  addStopPointCallback: (quayRef: string) => void;
  focusedMarker: FocusedMarker | undefined;
  focusMarkerCallback: (focusedMarker: FocusedMarker | undefined) => void;
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
  focusedMarker,
  focusMarkerCallback,
}: StopPlaceMarkerProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const stopPlaceLocation = getStopPlaceLocation(stopPlace);
  const isPopupToBeOpen = stopPlace.id === focusedMarker?.stopPlace.id;
  const markerRef: MutableRefObject<any> = useRef();

  useEffect(() => {
    if (isPopupToBeOpen) {
      if (markerRef && markerRef.current) {
        markerRef.current.openPopup();
        // Mission accomplished, locateSearchResult can be cleared now
        focusMarkerCallback(undefined);
      }
    }
  }, [isPopupToBeOpen, markerRef, focusMarkerCallback]);

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
