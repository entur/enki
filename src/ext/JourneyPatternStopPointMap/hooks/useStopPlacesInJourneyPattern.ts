import { StopPlace } from '../../../api';
import { useEffect, useState } from 'react';
import { JourneyPatternsStopPlacesState } from '../types';
import { getStopPlacesState } from '../helpers';

/**
 * Fetch stop places which include quays that are used throughout the journey pattern
 * @param stopPlacesInJourneyPattern
 */
export const useStopPlacesInJourneyPattern = (
  stopPlacesInJourneyPattern: StopPlace[],
) => {
  const [stopPlacesInJourneyPatternState, setStopPlacesInJourneyPatternState] =
    useState<JourneyPatternsStopPlacesState>(
      getStopPlacesState(stopPlacesInJourneyPattern),
    );

  useEffect(() => {
    // To avoid updating the state needlessly
    const stopPlacesInJourneyPatternIds = stopPlacesInJourneyPattern
      .map((s) => s.id)
      .sort((a, b) => a.localeCompare(b))
      .join(',');
    const stopPlacesInJourneyPatternStateIds =
      stopPlacesInJourneyPatternState.stopPlaces
        .map((s) => s.id)
        .sort((a, b) => a.localeCompare(b))
        .join(',');
    if (stopPlacesInJourneyPatternIds === stopPlacesInJourneyPatternStateIds) {
      return;
    }

    setStopPlacesInJourneyPatternState(
      getStopPlacesState(stopPlacesInJourneyPattern),
    );
  }, [stopPlacesInJourneyPattern]);

  return {
    stopPlacesInJourneyPatternState,
  };
};
