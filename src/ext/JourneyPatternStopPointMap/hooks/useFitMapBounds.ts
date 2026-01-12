import StopPoint from '../../../model/StopPoint';
import { Centroid } from '../../../api';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { getStopPointLocationSequence } from '../helpers';

/**
 * Set map's bounds on initial map load, based on user's existing journey pattern's quays locations.
 * Meant to zoom in far enough that it's easy to see for user how the route spans
 * @param pointsInSequence
 * @param quayLocationsIndex
 */
export const useFitMapBounds = (
  pointsInSequence: StopPoint[],
  quayLocationsIndex: Record<string, Centroid>,
) => {
  // This boundsBeenFit makes sure useEffect will do its thing only once,
  // as quayLocationsIndex can change when search is done
  const boundsBeenFit = useRef(false);
  const map = useMap();

  useEffect(() => {
    if (pointsInSequence?.length < 1) {
      // That's a new line form, boundsBeenFit needs to be set as done
      //boundsBeenFit.current = true;
      return;
    }

    const stopPointLocationSequence = getStopPointLocationSequence(
      pointsInSequence,
      quayLocationsIndex,
    );
    if (stopPointLocationSequence.length < 1) {
      // Could happen if there is a non-empty pointsInSequence but the quay id-s used in it no longer exist in the backend,
      // hence not found in quayLocationsIndex records
      return;
    }

    let minLat = stopPointLocationSequence[0][0];
    let maxLat = stopPointLocationSequence[0][0];
    let minLng = stopPointLocationSequence[0][1];
    let maxLng = stopPointLocationSequence[0][1];

    stopPointLocationSequence.forEach((location) => {
      if (location[0] < minLat) {
        minLat = location[0];
      } else if (location[0] > maxLat) {
        maxLat = location[0];
      }

      if (location[1] < minLng) {
        minLng = location[1];
      } else if (location[1] > maxLng) {
        maxLng = location[1];
      }
    });

    // boundsBeenFit.current = true;
    map.fitBounds([
      [minLat, minLng],
      [maxLat, maxLng],
    ]);
  }, []);
};
