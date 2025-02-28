import { Centroid } from '../../../api';
import { FocusedMarker, JourneyPatternMarkerType } from '../types';
import { useEffect } from 'react';

/**
 * When "locate stop point" was clicked from GenericStopPointEditor
 * @param focusedQuayId
 * @param quayLocationsIndex
 * @param quayStopPlaceIndex
 * @param focusMarkerCallback
 */
export const useHandleFocusedQuayId = (
  focusedQuayId: string | undefined | null,
  quayLocationsIndex: Record<string, Centroid>,
  quayStopPlaceIndex: Record<string, string>,
  focusMarkerCallback: (
    focusedMarker: FocusedMarker,
    updateOnlyFocusedMarkerState?: boolean,
  ) => void,
) => {
  useEffect(() => {
    if (focusedQuayId && quayLocationsIndex[focusedQuayId]) {
      const focusedStopPlaceId: string = quayStopPlaceIndex[focusedQuayId];
      // Let's produce a proper focusedMarker out of this
      const newFocusedMarker: FocusedMarker = {
        stopPlaceId: focusedStopPlaceId,
        marker: {
          id: focusedQuayId,
          location: quayLocationsIndex[focusedQuayId].location,
          type: JourneyPatternMarkerType.QUAY,
        },
      };
      focusMarkerCallback(newFocusedMarker, true);
      // Located stop point can be at the end of a long list of stop points, map needs to get into the view if not visible:
      window.scrollTo(0, 520);
    }
  }, [focusedQuayId, quayStopPlaceIndex, quayLocationsIndex]);
};
