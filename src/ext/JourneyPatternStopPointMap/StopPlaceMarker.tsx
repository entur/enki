import { StopPlace } from '../../api';
import { Button } from '@mui/material';
import { getMarkerIcon } from './markerIcons';
import { Marker, Popup } from 'react-leaflet';
import { useIntl } from 'react-intl';
import AddIcon from '@mui/icons-material/Add';
import StopPlaceDetails from './StopPlaceDetails';
import { memo, useRef } from 'react';
import { usePopupOpeningOnFocus } from './hooks/usePopupOpeningOnFocus';
import { getStopPlaceLocation } from './helpers';

interface StopPlaceMarkerProps {
  stopPlace: StopPlace;
  showQuays: (showAll: boolean, stopPlaceId: string) => void;
  addStopPoint: (quayRef: string) => void;
  isPopupToBeOpen: boolean;
  clearFocusedMarker: () => void;
}

const StopPlaceMarker = memo(
  ({
    stopPlace,
    showQuays,
    addStopPoint,
    isPopupToBeOpen,
    clearFocusedMarker,
  }: StopPlaceMarkerProps) => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const stopPlaceLocation = getStopPlaceLocation(stopPlace);
    const markerRef = useRef<any>(null);
    usePopupOpeningOnFocus(isPopupToBeOpen, markerRef, clearFocusedMarker);

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
                markerRef.current.closePopup();
                showQuays(true, stopPlace.id);
              }}
              variant="contained"
              size="small"
            >
              {formatMessage({ id: 'showQuays' })}
            </Button>
          ) : (
            <Button
              className={'popup-button'}
              onClick={() => {
                markerRef.current.closePopup();
                addStopPoint(stopPlace.quays[0].id);
                // To avoid grey area on the map once the container gets bigger in the height:
                window.dispatchEvent(new Event('resize'));
              }}
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
            >
              {formatMessage({ id: 'addToJourneyPattern' })}
            </Button>
          )}
        </Popup>
      </Marker>
    );
  },
);

export default StopPlaceMarker;
