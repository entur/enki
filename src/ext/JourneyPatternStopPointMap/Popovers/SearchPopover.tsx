import './styles.scss';
import { TextField } from '@entur/form';
import { SearchIcon } from '@entur/icons';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import debounce from '../../../components/StopPointsEditor/common/debounce';
import { VEHICLE_MODE } from '../../../model/enums';
import { useAppSelector } from '../../../store/hooks';
import SearchResult from './SearchResult';
import { StopPlace, UttuQuery } from '../../../api';
import { Label } from '@entur/typography';
import { useIntl } from 'react-intl';
import { getStopPlacesState, sortStopPlaces } from '../helpers';
import { FocusedMarker, JourneyPatternsStopPlacesState } from '../types';
import { useConfig } from '../../../config/ConfigContext';
import { useAuth } from '../../../auth/auth';
import { getStopPlacesQuery } from '../../../api/uttu/queries';
import { sentryCaptureException } from '../../../store/store';

interface SearchPopoverProps {
  searchedStopPlaces: StopPlace[];
  transportMode: VEHICLE_MODE;
  focusMarkerCallback: (focusedMarker: FocusedMarker) => void;
  getSelectedQuayIdsCallback: (stopPlace: StopPlace) => string[];
  updateSearchedStopPlacesCallback: (
    stopPlacesState: JourneyPatternsStopPlacesState,
  ) => void;
}

const SearchPopover = memo(
  ({
    searchedStopPlaces,
    transportMode,
    focusMarkerCallback,
    getSelectedQuayIdsCallback,
    updateSearchedStopPlacesCallback,
  }: SearchPopoverProps) => {
    const activeProvider =
      useAppSelector((state) => state.userContext.activeProviderCode) ?? '';
    const { uttuApiUrl } = useConfig();
    const auth = useAuth();

    const sortedStopPlaces = useMemo(() => {
      return [...searchedStopPlaces].sort(sortStopPlaces);
    }, [searchedStopPlaces]);

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

          auth.getAccessToken().then(async (token) => {
            try {
              const data = await UttuQuery(
                uttuApiUrl,
                activeProvider,
                getStopPlacesQuery,
                { transportMode, searchText: inputValue },
                token,
              );
              const newStopPlacesState = getStopPlacesState(data?.stopPlaces);
              updateSearchedStopPlacesCallback(newStopPlacesState);
            } catch (e) {
              sentryCaptureException(e);
            }
          });
        },
        1000,
        undefined,
      ),
      [transportMode],
    );

    useEffect(() => {
      setIsLoading(false);
    }, [searchedStopPlaces, setIsLoading]);

    const searchResults = useMemo(() => {
      return sortedStopPlaces.map((stopPlace: StopPlace, i: number) => (
        <SearchResult
          key={'map-search-result-' + stopPlace.id}
          focusMarkerCallback={focusMarkerCallback}
          stopPlace={stopPlace}
          isLast={i == searchedStopPlaces.length - 1}
          searchText={searchText as string}
          getSelectedQuayIdsCallback={getSelectedQuayIdsCallback}
        />
      ));
    }, [searchedStopPlaces]);

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
            updateSearchedStopPlacesCallback(getStopPlacesState(undefined));
          }}
          onChange={(e: any) => {
            setIsTyping(true);
            if (e.target.value?.length > 2) {
              debouncedSearch(e.target.value);
            } else {
              setIsTyping(false);
              updateSearchedStopPlacesCallback(getStopPlacesState(undefined));
            }
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
            {!isLoading &&
              !isTyping &&
              !(searchedStopPlaces?.length > 0) &&
              searchText?.length > 2 && (
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
                {searchResults}
              </div>
            ) : (
              ''
            )}
          </div>
        )}
      </div>
    );
  },
);

export default SearchPopover;
