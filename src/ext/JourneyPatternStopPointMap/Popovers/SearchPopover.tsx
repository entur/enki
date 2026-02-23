import './styles.scss';
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import debounce from '../../../components/StopPointsEditor/common/debounce';
import { VEHICLE_MODE } from '../../../model/enums';
import { useAppSelector } from '../../../store/hooks';
import SearchResult from './SearchResult';
import { StopPlace, UttuQuery } from '../../../api';
import { useIntl } from 'react-intl';
import { getStopPlacesState, sortStopPlaces } from '../helpers';
import { FocusedMarker, JourneyPatternsStopPlacesState } from '../types';
import { useConfig } from '../../../config/ConfigContext';
import { useAuth } from '../../../auth/auth';
import { getStopPlacesQuery } from '../../../api/uttu/queries';

interface SearchPopoverProps {
  searchedStopPlaces: StopPlace[];
  transportMode: VEHICLE_MODE;
  onSearchResultLocated: (focusedMarker: FocusedMarker) => void;
  getSelectedQuayIds: (stopPlace: StopPlace) => string[];
  onSearchedStopPlacesFetched: (
    stopPlacesState: JourneyPatternsStopPlacesState,
  ) => void;
}

const SearchPopover = memo(
  ({
    searchedStopPlaces,
    transportMode,
    onSearchResultLocated,
    getSelectedQuayIds,
    onSearchedStopPlacesFetched,
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
              onSearchedStopPlacesFetched(newStopPlacesState);
            } catch {
              // Error intentionally ignored - search failure is non-critical
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
          onSearchResultLocated={onSearchResultLocated}
          stopPlace={stopPlace}
          isLast={i == searchedStopPlaces.length - 1}
          searchText={searchText as string}
          getSelectedQuayIds={getSelectedQuayIds}
        />
      ));
    }, [searchedStopPlaces]);

    return (
      <div className={'search-popover'}>
        <TextField
          className={'search-input'}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchText('');
                      onSearchedStopPlacesFetched(
                        getStopPlacesState(undefined),
                      );
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
          placeholder={formatMessage({ id: 'mapSearchPlaceholder' })}
          value={searchText ?? ''}
          onChange={(e: any) => {
            setIsTyping(true);
            if (e.target.value?.length > 1) {
              debouncedSearch(e.target.value);
            } else {
              setIsTyping(false);
              onSearchedStopPlacesFetched(getStopPlacesState(undefined));
            }
            setSearchText(e.target.value);
          }}
        />
        {searchText && (
          <div className={'map-search-results-wrapper'}>
            {isLoading && (
              <div className={'map-search-status-label'}>
                <Typography variant="caption">
                  <i>{formatMessage({ id: 'mapSearchInProgress' })}</i>
                </Typography>
              </div>
            )}
            {!isLoading &&
              !isTyping &&
              !(searchedStopPlaces?.length > 0) &&
              searchText?.length > 1 && (
                <div className={'map-search-status-label'}>
                  <Typography variant="caption">
                    <i>{formatMessage({ id: 'mapSearchNoResults' })}</i>
                  </Typography>
                </div>
              )}
            {!isLoading && searchedStopPlaces?.length > 0 ? (
              <div className={'map-search-results-container'}>
                <Typography
                  variant="caption"
                  className="required-input map-search-results-label"
                >
                  <i>{formatMessage({ id: 'mapSearchResults' })}</i>
                </Typography>
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
