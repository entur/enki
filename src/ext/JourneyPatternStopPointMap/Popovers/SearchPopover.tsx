import './styles.scss';
import { TextField } from '@entur/form';
import { SearchIcon } from '@entur/icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from '../../../components/StopPointsEditor/common/debounce';
import { searchStopPlaces } from '../../../actions/stopPlaces';
import { useDispatch } from 'react-redux';
import { VEHICLE_MODE } from '../../../model/enums';
import { useAppSelector } from '../../../store/hooks';
import SearchResult from './SearchResult';
import { StopPlace } from '../../../api';
import { Label } from '@entur/typography';
import { StopPlacesState } from '../../../reducers/stopPlaces';
import { useIntl } from 'react-intl';
import { FocusedMarker } from '../JourneyPatternStopPointMap';

interface SearchPopoverProps {
  transportMode: VEHICLE_MODE;
  focusMarkerCallback: (focusedMarker: FocusedMarker) => void;
  getSelectedQuayIdsCallback: (stopPlace: StopPlace) => string[];
}

const sortStopPlaces = (a: StopPlace, b: StopPlace) => {
  if (a.name.value < b.name.value) {
    return -1;
  }
  if (a.name.value > b.name.value) {
    return 1;
  }
  return 0;
};

const SearchPopover = ({
  transportMode,
  focusMarkerCallback,
  getSelectedQuayIdsCallback,
}: SearchPopoverProps) => {
  const dispatch = useDispatch<any>();
  const stopPlacesState: StopPlacesState = useAppSelector(
    (state) => state.stopPlaces,
  ) as StopPlacesState;
  const searchedStopPlaces = stopPlacesState
    ? stopPlacesState.searchedStopPlaces
    : [];
  const sortedStopPlaces = useMemo(() => {
    return searchedStopPlaces
      ? [...searchedStopPlaces].sort(sortStopPlaces)
      : [];
  }, [searchedStopPlaces, sortStopPlaces]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const intl = useIntl();
  const { formatMessage } = intl;

  const debouncedSearch = useCallback(
    debounce(
      async (inputValue: string) => {
        setIsTyping(false);
        if (searchText === inputValue) {
          // well, just in case
          return;
        }
        setIsLoading(true);
        dispatch(searchStopPlaces(transportMode, inputValue));
      },
      1000,
      undefined,
    ),
    [transportMode],
  );

  useEffect(() => {
    setIsLoading(false);
  }, [searchedStopPlaces, setIsLoading]);

  return (
    <div className={'search-popover'}>
      <TextField
        label={''}
        className={'search-input'}
        prepend={<SearchIcon inline />}
        placeholder="Stop place by ID, name or quay ID"
        clearable={true}
        onClear={() => {
          setSearchText(undefined);
        }}
        onChange={(e: any) => {
          setIsTyping(true);
          debouncedSearch(e.target.value);
          setSearchText(e.target.value);
        }}
      />
      {searchText && (
        <div className={'map-search-results-wrapper'}>
          {isLoading && (
            <div style={{ padding: '0.75rem' }}>
              <Label>
                <i>{formatMessage({ id: 'mapSearchInProgress' })}</i>
              </Label>
            </div>
          )}
          {!isLoading && !isTyping && !(searchedStopPlaces?.length > 0) && (
            <div style={{ padding: '0.75rem' }}>
              <Label>
                <i>{formatMessage({ id: 'mapSearchNoResults' })}</i>
              </Label>
            </div>
          )}
          {!isLoading && searchedStopPlaces?.length > 0 ? (
            <div className={'map-search-results-container'}>
              <Label
                style={{
                  marginTop: '0.5rem',
                  marginLeft: '1rem',
                  marginBottom: 0,
                }}
                className="required-input"
              >
                <i>{formatMessage({ id: 'mapSearchResults' })}</i>
              </Label>
              {sortedStopPlaces.map((stopPlace: StopPlace, i: number) => (
                <SearchResult
                  key={'map-search-result-' + stopPlace.id}
                  focusMarkerCallback={focusMarkerCallback}
                  stopPlace={stopPlace}
                  isLast={i == searchedStopPlaces.length - 1}
                  searchText={searchText as string}
                  getSelectedQuayIdsCallback={getSelectedQuayIdsCallback}
                />
              ))}
            </div>
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPopover;
