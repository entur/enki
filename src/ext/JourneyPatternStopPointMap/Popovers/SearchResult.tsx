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
} from '../types';
import { determineQuayToFocus } from '../helpers';

interface SearchResultProps {
  stopPlace: StopPlace;
  isLast: boolean;
  searchText: string;
  focusMarkerCallback: (focusedMarker: FocusedMarker) => void;
  getSelectedQuayIdsCallback: (stopPlace: StopPlace) => string[];
}

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
          const selectedQuayIds = getSelectedQuayIdsCallback(stopPlace);
          if (searchText.includes('Quay') || selectedQuayIds?.length > 0) {
            // Find the most suitable quayId to open the popup of
            focusedMarker = determineQuayToFocus(
              searchText,
              stopPlace,
              selectedQuayIds,
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
