import { StopPlace } from '../../api';
import { Button } from '@entur/button';
import { getMarkerIcon } from './markers';
import { Marker, Popup } from 'react-leaflet';
import { useIntl } from 'react-intl';

interface StopPlaceMarkerProps {
  stopPlace: StopPlace;
  showQuaysCallback: () => void;
  addStopPointCallback: (quayRef: string) => void;
}

const StopPlaceMarker = ({
  stopPlace,
  showQuaysCallback,
  addStopPointCallback,
}: StopPlaceMarkerProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const stopPlaceLocation =
    stopPlace.centroid && stopPlace.quays.length > 1
      ? stopPlace.centroid.location
      : stopPlace.quays[0].centroid.location;

  return (
    <Marker
      key={'stop-place-marker-' + stopPlace.id}
      icon={getMarkerIcon(stopPlace.transportMode, true, false)}
      position={[stopPlaceLocation.latitude, stopPlaceLocation.longitude]}
    >
      <Popup>
        <section>
          <h4 className={'popup-title'}>{stopPlace.name.value}</h4>
          <div className={'popup-id'}>{stopPlace.id}</div>
        </section>

        <section>
          {formatMessage({ id: stopPlace.transportMode?.toLowerCase() })}
        </section>

        {stopPlace.quays.length > 1 ? (
          <section>
            {formatMessage(
              { id: 'numberOfQuays' },
              { count: stopPlace.quays.length },
            )}
          </section>
        ) : (
          <section>
            <div>{formatMessage({ id: 'oneQuay' })}</div>
            <div className={'popup-id'}>{stopPlace.quays[0].id}</div>
          </section>
        )}

        <Button
          className={'popup-button'}
          onClick={() => {
            if (stopPlace.quays?.length === 1) {
              addStopPointCallback(stopPlace.quays[0].id);
            }
            // When user selected a single quay, we still want to enter the "show quays" mode:
            showQuaysCallback();
          }}
          width="auto"
          variant="primary"
          size="small"
        >
          {stopPlace.quays?.length > 1
            ? formatMessage({ id: 'showQuays' })
            : formatMessage({ id: 'addToRoute' })}
        </Button>
      </Popup>
    </Marker>
  );
};

export default StopPlaceMarker;
