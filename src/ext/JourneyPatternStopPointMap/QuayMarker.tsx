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
        {quay.name?.value && quay.name?.value !== stopPlace.name.value ? (
          <div style={{ fontWeight: 600, color: '#1777F8' }}>
            Quay {quay.name?.value}
          </div>
        ) : (
          ''
        )}
        <div style={{ fontWeight: 600, paddingBottom: '0.25rem' }}>
          {quay.id}
        </div>
        <div style={{ paddingBottom: '0.5rem' }}>{stopPlace.transportMode}</div>
        <div style={{ display: 'flex' }}>
          <Button
            style={{
              marginRight: '0.5rem',
              fontSize: '14px',
              textWrap: 'nowrap',
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
              style={{ fontSize: '14px', textWrap: 'nowrap' }}
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
              style={{ fontSize: '14px', textWrap: 'nowrap' }}
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
