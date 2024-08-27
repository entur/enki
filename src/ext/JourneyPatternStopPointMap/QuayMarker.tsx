import { Quay, StopPlace } from '../../api';
import { getMarkerIcon } from './markers';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { Button } from '@entur/button';
import { useIntl } from 'react-intl';
import { Heading5 } from '@entur/typography';
import { AddIcon, DeleteIcon } from '@entur/icons';

interface QuayMarkerProps {
  quay: Quay;
  stopPlace: StopPlace;
  stopPointIndex: number | undefined;
  hasSelectedQuay: boolean;
  hasNonSelectedQuays: boolean;
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
  hasNonSelectedQuays,
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
      icon={getMarkerIcon(
        stopPlace.transportMode,
        false,
        stopPointIndex !== undefined,
      )}
      position={[
        quay.centroid?.location.latitude,
        quay.centroid?.location.longitude,
      ]}
    >
      <Popup>
        <section>
          <Heading5 className={'popup-title'}>{stopPlace.name.value}</Heading5>
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
              if (stopPointIndex !== undefined && hideNonSelectedQuaysState) {
                showQuaysCallback(false);
                hideNonSelectedQuaysCallback(false);
              }

              // Callback to update the GenericStopPointsEditor form state:
              if (stopPointIndex !== undefined) {
                deleteStopPointCallback(stopPointIndex);
              } else {
                addStopPointCallback(quay.id);
              }
            }}
            width="auto"
            variant="primary"
            size="small"
          >
            {stopPointIndex !== undefined ? <DeleteIcon /> : <AddIcon />}
            {stopPointIndex !== undefined
              ? formatMessage({ id: 'removeFromRoute' })
              : formatMessage({ id: 'addToJourneyPattern' })}
          </Button>
          {hasSelectedQuay && hasNonSelectedQuays ? (
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
      {stopPointIndex !== undefined && (
        <Tooltip direction="right" offset={[10, -17]} opacity={1} permanent>
          {stopPointIndex + 1}
        </Tooltip>
      )}
    </Marker>
  );
};

export default QuayMarker;
