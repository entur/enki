import { StopPlace } from '../../../api';
import { IconButton, Typography } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import React from 'react';
import {
  FocusedMarker,
  JourneyPatternMarker,
  JourneyPatternMarkerType,
} from '../types';
import { determineQuayToFocus, getStopPlaceLocation } from '../helpers';

interface SearchResultProps {
  stopPlace: StopPlace;
  isLast: boolean;
  searchText: string;
  onSearchResultLocated: (
    focusedMarker: FocusedMarker,
    updateOnlyFocusedMarkerState?: boolean,
  ) => void;
  getSelectedQuayIds: (stopPlace: StopPlace) => string[];
}

const SearchResult = ({
  stopPlace,
  isLast,
  onSearchResultLocated,
  searchText,
  getSelectedQuayIds,
}: SearchResultProps) => {
  return (
    <div
      className={`map-search-result ${!isLast ? 'map-search-result--not-last' : ''}`}
    >
      <div style={{ marginRight: '1rem' }}>
        <Typography variant="h5" className={'popup-title'}>
          {stopPlace.name.value}
        </Typography>
        <div className={'popup-id'}>{stopPlace.id}</div>
      </div>

      <IconButton
        onClick={() => {
          let focusedMarker: JourneyPatternMarker;
          const selectedQuayIds = getSelectedQuayIds(stopPlace);
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
              location: getStopPlaceLocation(stopPlace),
              type: JourneyPatternMarkerType.STOP_PLACE,
            };
          }

          onSearchResultLocated({
            stopPlaceId: stopPlace.id,
            quays: stopPlace.quays,
            marker: focusedMarker,
          });
        }}
      >
        <MyLocationIcon />
      </IconButton>
    </div>
  );
};

export default SearchResult;
