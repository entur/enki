import { Quay, StopPlace } from '../../api';
import { getMarkerIcon } from './markers';
import { Marker, Popup } from 'react-leaflet';
import { Button } from '@entur/button';
import { useIntl } from 'react-intl';

interface QuayMarkerProps {
  quay: Quay;
  stopPlace: StopPlace;
  stopPointIndex: number | undefined;
  hasSelectedQuay: boolean;
  hideNonSelectedQuaysState: boolean;
  hideNonSelectedQuaysCallback: (hideNonSelected: boolean) => void;
  showQuaysCallback: (showAll: boolean) => void;
  addStopPointCallback: (quayId: string) => void;
  deleteStopPointCallback: (index: number) => void;
}

const QuayMarker = ({
  quay,
  stopPointIndex,
  stopPlace,
  hasSelectedQuay,
  showQuaysCallback,
  hideNonSelectedQuaysCallback,
  hideNonSelectedQuaysState,
  addStopPointCallback,
  deleteStopPointCallback,
}: QuayMarkerProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  return (
    <Marker
      key={'quay-marker-' + quay.id}
      icon={getMarkerIcon(stopPlace.transportMode, false, !!stopPointIndex)}
      position={[
        quay.centroid?.location.latitude,
        quay.centroid?.location.longitude,
      ]}
    >
      <Popup>
        <section>
          <h4 className={'popup-title'}>{stopPlace.name.value}</h4>
          {quay.name?.value && quay.name?.value !== stopPlace.name.value ? (
            <h4 className={'popup-title'}>
              {formatMessage({ id: 'quayTitle' }, { name: quay.name?.value })}
            </h4>
          ) : (
            ''
          )}
          <div className={'popup-id'}>{quay.id}</div>
        </section>

        <section>
          {formatMessage({ id: stopPlace.transportMode?.toLowerCase() })}
        </section>

        <div className={'popup-button-panel'}>
          <Button
            className={'popup-button'}
            style={{
              marginRight: '0.5rem',
            }}
            onClick={() => {
              // If the quay got unselected and hideNonSelectedQuaysState mode was on, then switching to a stop place view:
              if (stopPointIndex && hideNonSelectedQuaysState) {
                showQuaysCallback(false);
                hideNonSelectedQuaysCallback(false);
              }

              // Callback to update the GenericStopPointsEditor form state:
              if (stopPointIndex) {
                deleteStopPointCallback(stopPointIndex);
              } else {
                addStopPointCallback(quay.id);
              }
            }}
            width="auto"
            variant="primary"
            size="small"
          >
            {stopPointIndex
              ? formatMessage({ id: 'removeFromRoute' })
              : formatMessage({ id: 'addToRoute' })}
          </Button>
          {hasSelectedQuay && stopPlace.quays.length > 1 ? (
            <Button
              className={'popup-button'}
              onClick={() =>
                hideNonSelectedQuaysCallback(!hideNonSelectedQuaysState)
              }
              width="auto"
              variant="primary"
              size="small"
            >
              {hideNonSelectedQuaysState
                ? formatMessage({ id: 'showNonSelectedQuays' })
                : formatMessage({ id: 'hideNonSelectedQuays' })}
            </Button>
          ) : (
            ''
          )}
          {!hasSelectedQuay && stopPlace.quays.length > 1 ? (
            <Button
              className={'popup-button'}
              onClick={() => showQuaysCallback(false)}
              width="auto"
              variant="primary"
              size="small"
            >
              {formatMessage({ id: 'hideQuays' })}
            </Button>
          ) : (
            ''
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default QuayMarker;
