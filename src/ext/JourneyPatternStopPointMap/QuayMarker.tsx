import { Quay, StopPlace } from '../../api';
import { getMarkerIcon } from './markers';
import { Marker, Popup } from 'react-leaflet';
import { Button } from '@entur/button';

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
          <div className={'popup-title'}>{stopPlace.name.value}</div>
          {quay.name?.value && quay.name?.value !== stopPlace.name.value ? (
            <div className={'popup-title'}>Quay {quay.name?.value}</div>
          ) : (
            ''
          )}
          <div className={'popup-id'}>{quay.id}</div>
        </section>

        <section>{stopPlace.transportMode}</section>

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
            {stopPointIndex ? 'Remove from' : 'Add to'} route
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
                ? 'Show non-selected'
                : 'Hide non-selected'}{' '}
              quays
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
              Hide all quays
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
