import './styles.scss';
import { TextField } from '@entur/form';
import { SearchIcon } from '@entur/icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from '../../../components/StopPointsEditor/common/debounce';
import {
  clearStopPlacesSearchResults,
  searchStopPlaces,
} from '../../../actions/stopPlaces';
import { useDispatch } from 'react-redux';
import { VEHICLE_MODE } from '../../../model/enums';
import { useAppSelector } from '../../../store/hooks';
import SearchResult from './SearchResult';
import { StopPlace } from '../../../api';
import { Label } from '@entur/typography';
import { StopPlacesState } from '../../../reducers/stopPlaces';
import { useIntl } from 'react-intl';
import { sortStopPlaces } from '../helpers';
import { FocusedMarker } from '../types';

interface SearchPopoverProps {
  transportMode: VEHICLE_MODE;
  focusMarkerCallback: (focusedMarker: FocusedMarker) => void;
  getSelectedQuayIdsCallback: (stopPlace: StopPlace) => string[];
}

const defaultSearchResults: StopPlace[] = [];

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
    : defaultSearchResults;
  const sortedStopPlaces = useMemo(() => {
    return [...searchedStopPlaces].sort(sortStopPlaces);
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
        placeholder={formatMessage({ id: 'mapSearchPlaceholder' })}
        clearable={true}
        value={searchText}
        onClear={() => {
          setSearchText('');
          dispatch(clearStopPlacesSearchResults());
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
            <div className={'map-search-status-label'}>
              <Label>
                <i>{formatMessage({ id: 'mapSearchInProgress' })}</i>
              </Label>
            </div>
          )}
          {!isLoading && !isTyping && !(searchedStopPlaces?.length > 0) && (
            <div className={'map-search-status-label'}>
              <Label>
                <i>{formatMessage({ id: 'mapSearchNoResults' })}</i>
              </Label>
            </div>
          )}
          {!isLoading && searchedStopPlaces?.length > 0 ? (
            <div className={'map-search-results-container'}>
              <Label className="required-input map-search-results-label">
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
