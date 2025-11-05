import React from 'react';
import { useMapEvents } from 'react-leaflet';

export interface MapEventsProps {
  handleBaselayerChanged: (name: string) => void;
  onClick?: () => void;
  onDblclick?: () => void;
  onZoomEnd?: () => void;
  onMoveEnd?: () => void;
  children?: JSX.Element;
}

export const MapEvents: React.FC<MapEventsProps> = ({
  children,
  handleBaselayerChanged = () => {},
  onClick = () => {},
  onDblclick = () => {},
  onZoomEnd = () => {},
  onMoveEnd = () => {},
}) => {
  useMapEvents({
    baselayerchange: ({ name }) => {
      handleBaselayerChanged(name);
    },
    click: onClick,
    dblclick: onDblclick,
    zoomend: onZoomEnd,
    moveend: onMoveEnd,
  });

  return <>{children}</>;
};
