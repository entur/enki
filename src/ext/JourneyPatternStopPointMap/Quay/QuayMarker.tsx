import { Quay, StopPlace } from '../../../api';
import { getMarkerIcon } from '../markers';
import { Marker, Popup } from 'react-leaflet';
import { useIntl } from 'react-intl';
import { Heading5 } from '@entur/typography';
import React, { MutableRefObject, useRef } from 'react';
import QuayIndexTooltip from './QuayIndexTooltip';
import QuayPositionChips from './QuayPositionChips';
import QuayPopupButtonPanel from './QuayPopupButtonPanel';

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
  const markerRef: MutableRefObject<any> = useRef();
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
          <QuayPositionChips
            stopPointIndexes={stopPointIndexes}
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

      {stopPointIndexes?.length > 0 && (
        <QuayIndexTooltip
          markerRef={markerRef}
          stopPointIndexes={stopPointIndexes}
          quayId={quay.id}
        />
      )}
    </Marker>
  );
};

export default QuayMarker;
