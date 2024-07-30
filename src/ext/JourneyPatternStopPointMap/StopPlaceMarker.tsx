import { StopPlace } from '../../api';
import { Button } from '@entur/button';
import { useQuays } from '../../components/StopPointsEditor/Generic/QuaysContext';
import { getMarkerIcon } from './markers';
import { Marker, Popup } from 'react-leaflet';

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
        <section>
          <div className={'popup-title'}>{stopPlace.name.value}</div>
          <div className={'popup-id'}>{stopPlace.id}</div>
        </section>

        <section>
          <div>{stopPlace.transportMode}</div>
          <div>{stopPlace.stopPlaceType}</div>
        </section>

        {stopPlace.quays.length > 1 ? (
          <section>{stopPlace.quays.length} quays</section>
        ) : (
          <section>
            <div>1 quay:</div>
            <div className={'popup-id'}>{stopPlace.quays[0].id}</div>
          </section>
        )}

        <Button
          className={'popup-button'}
          onClick={() => {
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
          {stopPlace.quays?.length > 1 ? 'Show quays' : 'Add to route'}
        </Button>
      </Popup>
    </Marker>
  );
};

export default StopPlaceMarker;
