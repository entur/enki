import React from 'react';
import { useMapEvents } from 'react-leaflet';

export interface MapEventsProps {
  handleBaselayerChanged: (name: string) => void;
}

/**
 * Hook-based component that listens to Leaflet map events.
 * Currently handles base layer changes and triggers the provided callback.
 */
export const MapEvents = ({ handleBaselayerChanged }: MapEventsProps) => {
  useMapEvents({
    baselayerchange: (e) => {
      handleBaselayerChanged(e.name);
    },
  });
  return <></>;
};
