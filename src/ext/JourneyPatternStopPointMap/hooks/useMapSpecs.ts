import { useMap } from 'react-leaflet';
import { Reducer, useCallback, useEffect, useReducer } from 'react';
import { MapSpecs } from '../types';
import debounce from '../../../components/StopPointsEditor/common/debounce';

/**
 * This captures current zoom level and view bounds and updates the state containing those.
 * Used by supercluster to produce clusters and single stops based on the "map specs" (such as zoom or view bounds)
 */
export const useMapSpecs = () => {
  const map = useMap();
  const [mapSpecsState, setMapSpecsState] = useReducer<
    Reducer<MapSpecs, Partial<MapSpecs>>
  >(
    (state: MapSpecs, newState: Partial<MapSpecs>) => ({
      ...state,
      ...newState,
    }),
    {
      zoom: 0,
      bounds: [0, 0, 0, 0],
    },
  );

  const updateMapSpecs = useCallback(
    debounce(
      () => {
        const newBounds = map.getBounds();
        const newState: MapSpecs = {
          zoom: map.getZoom(),
          bounds: [
            newBounds.getSouthWest().lng,
            newBounds.getSouthWest().lat,
            newBounds.getNorthEast().lng,
            newBounds.getNorthEast().lat,
          ],
        };
        setMapSpecsState(newState);
      },
      400,
      undefined,
    ),
    [map],
  );

  useEffect(() => {
    updateMapSpecs();
  }, []);

  return {
    mapSpecsState,
    updateMapSpecs,
  };
};
