import { Quay, StopPlace } from '../../api';
import { useQuays } from '../../components/StopPointsEditor/Generic/QuaysContext';
import { getMarkerIcon } from './markers';
import { Marker, Popup } from 'react-leaflet';
import { Button } from '@entur/button';

interface QuayMarkerProps {
  selectedQuay: Quay | undefined;
  quay: Quay;
  stopPlace: StopPlace;
  showQuaysCallback: (showAll: boolean) => void;
  hideNonSelectedQuaysCallback: (hideNonSelected: boolean) => void;
  hideNonSelectedQuaysState: boolean;
}

const QuayMarker = ({
  quay,
  stopPlace,
  selectedQuay,
  showQuaysCallback,
  hideNonSelectedQuaysCallback,
  hideNonSelectedQuaysState,
}: QuayMarkerProps) => {
  const { quaySelectionStates, setQuaySelectionStates } = useQuays();

  return (
    <Marker
      key={quay.id}
      icon={getMarkerIcon(
        stopPlace.transportMode,
        false,
        quaySelectionStates[quay.id],
      )}
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
              const newQuaySelectionStates = {
                ...quaySelectionStates,
              };
              newQuaySelectionStates[quay.id] = !quaySelectionStates[quay.id];
              if (selectedQuay && selectedQuay.id !== quay.id) {
                newQuaySelectionStates[selectedQuay.id] = false;
              }
              if (quaySelectionStates[quay.id] && hideNonSelectedQuaysState) {
                showQuaysCallback(false);
                hideNonSelectedQuaysCallback(false);
              }
              setQuaySelectionStates(newQuaySelectionStates);
            }}
            width="auto"
            variant="primary"
            size="small"
          >
            {quaySelectionStates[quay.id] ? 'Remove from' : 'Add to'} route
          </Button>
          {selectedQuay && stopPlace.quays.length > 1 ? (
            <Button
              className={'popup-button'}
              onClick={() =>
                hideNonSelectedQuaysCallback(!hideNonSelectedQuaysState)
              }
              width="auto"
              variant="primary"
              size="small"
            >
              {hideNonSelectedQuaysState ? 'Show other' : 'Hide other'} quays
            </Button>
          ) : (
            ''
          )}
          {!selectedQuay && stopPlace.quays.length > 1 ? (
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
