import { StopPlace } from '../../../api';
import { Heading5 } from '@entur/typography';
import { PositionIcon } from '@entur/icons';
import React from 'react';
import { TertiarySquareButton } from '@entur/button';
import { useMap } from 'react-leaflet';
import { getStopPlaceLocation } from '../StopPlaceMarker';

interface SearchResultProps {
  stopPlace: StopPlace;
  isLast: boolean;
  searchText: string;
  locateSearchResultCallback: (
    searchText: string,
    stopPlace: StopPlace,
  ) => void;
}

const SearchResult = ({
  stopPlace,
  isLast,
  locateSearchResultCallback,
  searchText,
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
          locateSearchResultCallback(searchText, stopPlace);
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
