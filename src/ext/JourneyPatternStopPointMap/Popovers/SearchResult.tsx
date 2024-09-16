import { StopPlace } from '../../../api';
import { Heading5 } from '@entur/typography';
import { PositionIcon } from '@entur/icons';
import React from 'react';
import { TertiarySquareButton } from '@entur/button';
import { useMap } from 'react-leaflet';
import { getStopPlaceLocation } from '../StopPlaceMarker';
import {
  FocusedMarker,
  JourneyPatternMarker,
  JourneyPatternMarkerType,
} from '../JourneyPatternStopPointMap';

interface SearchResultProps {
  stopPlace: StopPlace;
  isLast: boolean;
  searchText: string;
  focusMarkerCallback: (focusedMarker: FocusedMarker) => void;
  getSelectedQuayIdsCallback: (stopPlace: StopPlace) => string[];
}

const determineQuayToFocus = (
  searchText: string,
  stopPlace: StopPlace,
  getSelectedQuayIdsCallback: (stopPlace: StopPlace) => string[],
) => {
  const quayFullyMatchingSearch = stopPlace.quays.filter(
    (q) => q.id === searchText,
  )[0];
  if (quayFullyMatchingSearch) {
    return {
      id: quayFullyMatchingSearch.id,
      type: JourneyPatternMarkerType.QUAY,
    };
  }

  const quayContainingSearch = stopPlace.quays.filter((q) =>
    q.id.includes(searchText),
  )[0];
  if (quayContainingSearch) {
    return { id: quayContainingSearch.id, type: JourneyPatternMarkerType.QUAY };
  }

  const selectedQuaysIds = getSelectedQuayIdsCallback(stopPlace);
  const firstSelectedQuayId =
    selectedQuaysIds.length > 0 ? selectedQuaysIds[0] : undefined;
  if (firstSelectedQuayId) {
    return { id: firstSelectedQuayId, type: JourneyPatternMarkerType.QUAY };
  }

  const justTheFirstQuay = stopPlace.quays[0];
  return { id: justTheFirstQuay.id, type: JourneyPatternMarkerType.QUAY };
};

const SearchResult = ({
  stopPlace,
  isLast,
  focusMarkerCallback,
  searchText,
  getSelectedQuayIdsCallback,
}: SearchResultProps) => {
  const map = useMap();
  const stopPlaceLocation = getStopPlaceLocation(stopPlace);

  return (
    <div
      className={`map-search-result ${!isLast ? 'map-search-result--not-last' : ''}`}
    >
      <div style={{ marginRight: '1rem' }}>
        <Heading5 className={'popup-title'}>{stopPlace.name.value}</Heading5>
        <div className={'popup-id'}>{stopPlace.id}</div>
      </div>

      <TertiarySquareButton
        onClick={() => {
          let focusedMarker: JourneyPatternMarker;
          if (searchText.includes('Quay')) {
            // Find the most suitable quayId to open the popup of
            focusedMarker = determineQuayToFocus(
              searchText,
              stopPlace,
              getSelectedQuayIdsCallback,
            );
          } else {
            focusedMarker = {
              id: stopPlace.id,
              type: JourneyPatternMarkerType.STOP_PLACE,
            };
          }

          focusMarkerCallback({
            stopPlace,
            marker: focusedMarker,
          });
          map.setView(
            [stopPlaceLocation.latitude, stopPlaceLocation.longitude],
            16,
          );
        }}
      >
        <PositionIcon />
      </TertiarySquareButton>
    </div>
  );
};

export default SearchResult;
