import { Quay, StopPlace } from '../../../api';
import { getMarkerIcon } from '../markers';
import { Marker, Popup } from 'react-leaflet';
import { useIntl } from 'react-intl';
import { Heading5 } from '@entur/typography';
import React, { MutableRefObject, useEffect, useRef } from 'react';
import QuaySequenceIndexTooltip from './QuaySequenceIndexTooltip';
import QuayPositionChips from './QuayPositionChips';
import QuayPopupButtonPanel from './QuayPopupButtonPanel';

interface QuayMarkerProps {
  quay: Quay;
  stopPlace: StopPlace;
  stopPointSequenceIndexes: number[];
  isSelectedQuay: boolean;
  hasSelectedQuay: boolean;
  hasNonSelectedQuays: boolean;
  hideNonSelectedQuaysState: boolean;
  hideNonSelectedQuaysCallback: (hideNonSelected: boolean) => void;
  showQuaysCallback: (showAll: boolean) => void;
  addStopPointCallback: (quayId: string) => void;
  deleteStopPointCallback: (index: number) => void;
  isPopupToBeOpen: boolean;
  clearLocateSearchResult: () => void;
}

const QuayMarker = ({
  quay,
  stopPointSequenceIndexes,
  stopPlace,
  isSelectedQuay,
  hasSelectedQuay,
  hasNonSelectedQuays,
  showQuaysCallback,
  hideNonSelectedQuaysCallback,
  hideNonSelectedQuaysState,
  addStopPointCallback,
  deleteStopPointCallback,
  isPopupToBeOpen,
  clearLocateSearchResult,
}: QuayMarkerProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const markerRef: MutableRefObject<any> = useRef();

  useEffect(() => {
    if (isPopupToBeOpen) {
      if (markerRef && markerRef.current) {
        markerRef.current.openPopup();
        // Mission accomplished, locateSearchResult can be cleared now
        clearLocateSearchResult();
      }
    }
  }, [isPopupToBeOpen, markerRef, clearLocateSearchResult]);

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
          <Heading5 className={'popup-title'}>{stopPlace.name.value}</Heading5>
          <div className={'popup-id'}>{quay.id}</div>
        </section>

        <section>
          {formatMessage({ id: stopPlace.transportMode?.toLowerCase() })}
        </section>

        {isSelectedQuay && (
          <QuayPositionChips
            quayId={quay.id}
            stopPointSequenceIndexes={stopPointSequenceIndexes}
            deleteStopPointCallback={deleteStopPointCallback}
          />
        )}

        <QuayPopupButtonPanel
          quayId={quay.id}
          quaysTotalCount={stopPlace.quays.length}
          hasSelectedQuay={hasSelectedQuay}
          hasNonSelectedQuays={hasNonSelectedQuays}
          hideNonSelectedQuaysState={hideNonSelectedQuaysState}
          hideNonSelectedQuaysCallback={hideNonSelectedQuaysCallback}
          showQuaysCallback={showQuaysCallback}
          addStopPointCallback={addStopPointCallback}
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
};

export default QuayMarker;
