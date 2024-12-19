import { Quay, StopPlace } from '../../../api';
import { getMarkerIcon } from '../markerIcons';
import { Marker, Popup } from 'react-leaflet';
import { useIntl } from 'react-intl';
import { Heading5 } from '@entur/typography';
import React, { memo, MutableRefObject, useRef } from 'react';
import QuaySequenceIndexTooltip from './QuaySequenceIndexTooltip';
import QuayPositionChips from './QuayPositionChips';
import QuayPopupButtonPanel from './QuayPopupButtonPanel';
import { usePopupOpeningOnFocus } from '../hooks';

interface QuayMarkerProps {
  quay: Quay;
  stopPlace: StopPlace;
  stopPointSequenceIndexes: number[];
  isSelectedQuay: boolean;
  hasSelectedQuay: boolean;
  hasNonSelectedQuays: boolean;
  hideNonSelectedQuaysState: boolean;
  hideNonSelectedQuays: (hideNonSelected: boolean) => void;
  showQuays: (showAll: boolean) => void;
  addStopPoint: (quayId: string) => void;
  deleteStopPoint: (index: number) => void;
  isPopupToBeOpen: boolean;
  clearFocusedMarker: () => void;
}

const QuayMarker = memo(
  ({
    quay,
    stopPointSequenceIndexes,
    stopPlace,
    isSelectedQuay,
    hasSelectedQuay,
    hasNonSelectedQuays,
    showQuays,
    hideNonSelectedQuays,
    hideNonSelectedQuaysState,
    addStopPoint,
    deleteStopPoint,
    isPopupToBeOpen,
    clearFocusedMarker,
  }: QuayMarkerProps) => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const markerRef: MutableRefObject<any> = useRef();
    usePopupOpeningOnFocus(isPopupToBeOpen, markerRef, clearFocusedMarker);

    return (
      <Marker
        key={'quay-marker-' + quay.id}
        ref={markerRef}
        icon={getMarkerIcon(stopPlace.transportMode, false, isSelectedQuay)}
        position={[
          quay.centroid?.location.latitude,
          quay.centroid?.location.longitude,
        ]}
      >
        <Popup>
          <section>
            <Heading5 className={'popup-title'}>
              {stopPlace.name.value}
            </Heading5>
            <div className={'popup-id'}>{quay.id}</div>
          </section>

          <section>
            {formatMessage({ id: stopPlace.transportMode?.toLowerCase() })}
          </section>

          {isSelectedQuay && (
            <QuayPositionChips
              quayId={quay.id}
              stopPointSequenceIndexes={stopPointSequenceIndexes}
              deleteStopPointCallback={deleteStopPoint}
            />
          )}

          <QuayPopupButtonPanel
            markerRef={markerRef}
            quayId={quay.id}
            quaysTotalCount={stopPlace.quays.length}
            hasSelectedQuay={hasSelectedQuay}
            hasNonSelectedQuays={hasNonSelectedQuays}
            hideNonSelectedQuaysState={hideNonSelectedQuaysState}
            hideNonSelectedQuays={hideNonSelectedQuays}
            showQuays={showQuays}
            addStopPoint={addStopPoint}
          />
        </Popup>

        {isSelectedQuay && (
          <QuaySequenceIndexTooltip
            markerRef={markerRef}
            stopPointSequenceIndexes={stopPointSequenceIndexes}
            quayId={quay.id}
          />
        )}
      </Marker>
    );
  },
);

export default QuayMarker;
