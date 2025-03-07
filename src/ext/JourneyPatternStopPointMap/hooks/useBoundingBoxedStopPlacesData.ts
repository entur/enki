import { useAppSelector } from 'store/hooks';
import { JourneyPatternsStopPlacesState, MapSpecs } from '../types';
import { useConfig } from '../../../config/ConfigContext';
import { Reducer, useEffect, useReducer, useState } from 'react';
import { useAuth } from '../../../auth/auth';
import { UttuQuery } from '../../../api';
import { getStopPlacesQuery } from '../../../api/uttu/queries';
import { getStopPlacesState } from '../helpers';

/**
 * Fetching stops data based on bounding box coordinates
 * @param transportMode
 * @param mapSpecsState contains the coordinates of the visible piece of map
 */
export const useBoundingBoxedStopPlacesData = (
  transportMode: string | undefined,
  mapSpecsState: MapSpecs,
) => {
  const activeProvider =
    useAppSelector((state) => state.userContext.activeProviderCode) ?? '';
  const { uttuApiUrl, journeyPatternMapStopPlacesLimit } = useConfig();
  const auth = useAuth();
  const [isStopDataLoading, setIsStopDataLoading] = useState<boolean>(false);

  const [stopPlacesState, setStopPlacesState] = useReducer<
    Reducer<
      JourneyPatternsStopPlacesState,
      Partial<JourneyPatternsStopPlacesState>
    >
  >(
    (
      state: JourneyPatternsStopPlacesState,
      newState: Partial<JourneyPatternsStopPlacesState>,
    ) => ({
      ...state,
      ...newState,
    }),
    {
      stopPlaces: [],
      quayLocationsIndex: {},
      quayStopPlaceIndex: {},
    },
  );

  useEffect(() => {
    if (
      transportMode &&
      mapSpecsState.zoom &&
      mapSpecsState.bounds[3] &&
      mapSpecsState.bounds[2] &&
      mapSpecsState.bounds[1] &&
      mapSpecsState.bounds[0]
    ) {
      auth.getAccessToken().then((token) => {
        const loadingTimeout = setTimeout(() => {
          setIsStopDataLoading(true);
        }, 1250);

        UttuQuery(
          uttuApiUrl,
          activeProvider,
          getStopPlacesQuery,
          {
            transportMode,
            searchText: undefined,
            quayIds: undefined,
            northEastLat: mapSpecsState.bounds[3],
            northEastLng: mapSpecsState.bounds[2],
            southWestLat: mapSpecsState.bounds[1],
            southWestLng: mapSpecsState.bounds[0],
            limit: journeyPatternMapStopPlacesLimit || 3500,
          },
          token,
        )
          .then((data) => {
            setStopPlacesState(getStopPlacesState(data?.stopPlaces || []));
          })
          .finally(() => {
            clearTimeout(loadingTimeout);
            setIsStopDataLoading(false);
          });
      });
    }
  }, [
    mapSpecsState.bounds[3],
    mapSpecsState.bounds[2],
    mapSpecsState.bounds[1],
    mapSpecsState.bounds[0],
  ]);

  return {
    stopPlacesState,
    isStopDataLoading,
  };
};
