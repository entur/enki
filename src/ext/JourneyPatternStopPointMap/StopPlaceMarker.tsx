import { StopPlace } from '../../api';
import { Button } from '@entur/button';
import { useQuays } from '../../components/StopPointsEditor/Generic/QuaysContext';
import { getMarkerIcon } from './markers';
import { Marker, Popup, Tooltip } from 'react-leaflet';

interface StopPlaceMarkerProps {
  stopPlace: StopPlace;
  showQuaysCallback: () => void;
}

const StopPlaceMarker = ({
  stopPlace,
  showQuaysCallback,
}: StopPlaceMarkerProps) => {
  const { quaySelectionStates, setQuaySelectionStates } = useQuays();

  return (
    <Marker
      key={stopPlace.id}
      icon={getMarkerIcon(stopPlace.transportMode, true, false)}
      position={[
        stopPlace.quays[0].centroid.location.latitude,
        stopPlace.quays[0].centroid.location.longitude,
      ]}
    >
      <Popup>
        <div
          style={{
            fontWeight: 600,
            color: '#1777F8',
            fontSize: '16px',
            textWrap: 'nowrap',
          }}
        >
          {stopPlace.name.value}
        </div>
        <div style={{ fontWeight: 600, paddingBottom: '0.25rem' }}>
          {stopPlace.id}
        </div>
        <div>{stopPlace.transportMode}</div>
        <div style={{ paddingBottom: '0.5rem' }}>{stopPlace.stopPlaceType}</div>
        {stopPlace.quays.length > 1 ? (
          <div style={{ paddingBottom: '0.5rem' }}>
            {stopPlace.quays.length} quays
          </div>
        ) : (
          <div style={{ paddingBottom: '0.5rem' }}>
            <div>1 quay:</div>
            <div style={{ fontWeight: 600 }}>{stopPlace.quays[0].id}</div>
          </div>
        )}

        <Button
          style={{ fontSize: '14px', textWrap: 'nowrap' }}
          onClick={(event) => {
            if (stopPlace.quays?.length === 1) {
              const newQuaySelectionStates = {
                ...quaySelectionStates,
              };
              newQuaySelectionStates[stopPlace.quays[0].id] = true;
              setQuaySelectionStates(newQuaySelectionStates);
            }
            // If user selected a single quay, we also want to enter the "show quays" mode:
            showQuaysCallback();
          }}
          width="auto"
          variant="primary"
          size="small"
        >
          {stopPlace.quays?.length > 1 ? 'Show quays' : 'Select quay'}
        </Button>
      </Popup>
      <Tooltip>Click to view quays or select one</Tooltip>
    </Marker>
  );
};

export default StopPlaceMarker;
