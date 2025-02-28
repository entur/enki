import { Location } from '../../../api';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

/**
 * Zoom into location. For example, when location a stop/quay from the search or stop point editor
 * @param location
 */
export const useMapZoomIntoLocation = (location: Location | undefined) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 16);
    }
  }, [location, map]);
};
