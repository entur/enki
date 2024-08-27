import { Quay, StopPlace } from '../../api';
import { getMarkerIcon } from './markers';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { Button, SecondaryButton } from '@entur/button';
import { useIntl } from 'react-intl';
import { Heading5 } from '@entur/typography';
import React, { useRef } from 'react';
import { TagChip } from '@entur/chip';
import { AddIcon } from '@entur/icons';

interface QuayMarkerProps {
  quay: Quay;
  stopPlace: StopPlace;
  stopPointIndexes: number[];
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
  stopPointIndexes,
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
  const markerRef = useRef();
  console.log(quay.id, stopPointIndexes);
  const isQuaySelected = stopPointIndexes?.length > 0;
  return (
    <Marker
      key={'quay-marker-' + quay.id}
      ref={markerRef}
      icon={getMarkerIcon(stopPlace.transportMode, false, isQuaySelected)}
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

        {stopPointIndexes?.length > 0 && (
          <section>
            <div>Position in route:</div>
            <div style={{ display: 'flex', marginBottom: '0.3rem' }}>
              {stopPointIndexes.map((index) => (
                <TagChip
                  className={'stop-point-index-chip'}
                  size={'small'}
                  onClose={() => {
                    deleteStopPointCallback(index);
                  }}
                >
                  {index + 1}
                </TagChip>
              ))}
            </div>
          </section>
        )}

        <div className={'popup-button-panel'}>
          <Button
            className={'popup-button'}
            onClick={() => {
              addStopPointCallback(quay.id);
              /*// If the quay got unselected and hideNonSelectedQuaysState mode was on, then switching to a stop place view:
              if (stopPointIndex !== undefined && hideNonSelectedQuaysState) {
                showQuaysCallback(false);
                hideNonSelectedQuaysCallback(false);
              }*/

              // Callback to update the GenericStopPointsEditor form state:
              /*if (stopPointIndex !== undefined) {
                deleteStopPointCallback(stopPointIndex);
              } else {
                addStopPointCallback(quay.id);
              }*/
            }}
            width="auto"
            variant="primary"
            size="small"
          >
            <AddIcon />
            {formatMessage({ id: 'addToJourneyPattern' })}
          </Button>
          {hasSelectedQuay && hasNonSelectedQuays ? (
            <SecondaryButton
              className={'popup-button'}
              style={{
                marginLeft: '0.5rem',
              }}
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
            </SecondaryButton>
          ) : (
            ''
          )}
          {!hasSelectedQuay && stopPlace.quays.length > 1 ? (
            <SecondaryButton
              className={'popup-button'}
              style={{
                marginLeft: '0.5rem',
              }}
              onClick={() => showQuaysCallback(false)}
              width="auto"
              variant="primary"
              size="small"
            >
              {formatMessage({ id: 'hideQuays' })}
            </SecondaryButton>
          ) : (
            ''
          )}
        </div>
      </Popup>
      {stopPointIndexes?.length > 0 && (
        <Tooltip
          onClick={() => {
            markerRef.current.openPopup();
          }}
          interactive={true}
          direction="right"
          offset={[10, -17]}
          opacity={1}
          permanent
        >
          <div
            style={{
              display:
                'flex' /* applying flex on this level instead of <Tooltip> is important */,
            }}
          >
            {stopPointIndexes.map((index, i) => {
              const isLast = i == stopPointIndexes.length - 1;
              return (
                <span
                  key={'tooltip-index-' + quay.id + '-' + index}
                  className={!isLast ? 'stop-point-index-tooltip-item' : ''}
                >
                  {index + 1}
                </span>
              );
            })}
          </div>
        </Tooltip>
      )}
    </Marker>
  );
};

export default QuayMarker;
