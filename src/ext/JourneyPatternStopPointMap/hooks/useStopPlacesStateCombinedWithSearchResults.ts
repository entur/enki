import { Centroid, StopPlace } from '../../../api';
import { JourneyPatternsStopPlacesState } from '../types';
import { useMemo } from 'react';

const defaultStopPlaces: StopPlace[] = [];

/**
 * Combines two stop places data sets: one gotten from a normal initial stop places fetch,
 * and the other gotten by using the search input
 * @param boundingBoxedStopPlacesState
 * @param searchedStopPlacesState
 * @param stopPlacesInJourneyPatternState
 */
export const useStopPlacesStateCombinedWithSearchResults = (
  boundingBoxedStopPlacesState: JourneyPatternsStopPlacesState,
  searchedStopPlacesState: JourneyPatternsStopPlacesState,
  stopPlacesInJourneyPatternState: JourneyPatternsStopPlacesState,
) => {
  const boundingBoxedStopPlaces =
    boundingBoxedStopPlacesState?.stopPlaces || defaultStopPlaces;

  // Combining the bounding box-ed stop places set and the search results and stops from journey pattern:
  const totalStopPlaces = useMemo(() => {
    const total = [...boundingBoxedStopPlaces];
    const searchedStopPlacesToCombine = [...searchedStopPlacesState.stopPlaces];
    searchedStopPlacesToCombine.forEach((stopPlace) => {
      if (total.filter((s) => s.id === stopPlace.id).length === 0) {
        total.push(stopPlace);
      }
    });

    const stopPlacesInJourneyPatternToCombine = [
      ...stopPlacesInJourneyPatternState.stopPlaces,
    ];
    stopPlacesInJourneyPatternToCombine.forEach((stopPlace) => {
      if (total.filter((s) => s.id === stopPlace.id).length === 0) {
        total.push(stopPlace);
      }
    });

    return total;
  }, [
    boundingBoxedStopPlaces,
    searchedStopPlacesState.stopPlaces,
    stopPlacesInJourneyPatternState.stopPlaces,
  ]);

  const totalQuayLocationsIndex: Record<string, Centroid> = useMemo(() => {
    return {
      ...boundingBoxedStopPlacesState?.quayLocationsIndex,
      ...searchedStopPlacesState.quayLocationsIndex,
      ...stopPlacesInJourneyPatternState.quayLocationsIndex,
    };
  }, [
    boundingBoxedStopPlacesState?.quayLocationsIndex,
    searchedStopPlacesState.quayLocationsIndex,
    stopPlacesInJourneyPatternState.quayLocationsIndex,
  ]);

  const totalQuayStopPlaceIndex: Record<string, string> = useMemo(() => {
    return {
      ...boundingBoxedStopPlacesState?.quayStopPlaceIndex,
      ...searchedStopPlacesState.quayStopPlaceIndex,
      ...stopPlacesInJourneyPatternState.quayStopPlaceIndex,
    };
  }, [
    boundingBoxedStopPlacesState?.quayStopPlaceIndex,
    searchedStopPlacesState.quayStopPlaceIndex,
    stopPlacesInJourneyPatternState.quayStopPlaceIndex,
  ]);

  return {
    totalStopPlaces,
    totalQuayLocationsIndex,
    totalQuayStopPlaceIndex,
  };
};
