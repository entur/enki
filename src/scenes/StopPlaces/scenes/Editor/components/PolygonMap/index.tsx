import { LatLngTuple, LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { useCallback } from 'react';
import { Polygon, useMap, useMapEvent } from 'react-leaflet';

type Props = {
  addCoordinate: (e: LeafletMouseEvent) => void;
  polygon: LatLngTuple[];
  otherPolygons: LatLngTuple[][];
};

const PolygonMap = (props: Props) => {
  const map = useMap();
  const addPolygonEventHandler = useCallback(
    (e: LeafletEvent) => {
      if (e.target.getBounds().isValid()) {
        map.setView(e.target.getBounds().getCenter());
      }
    },
    [map],
  );
  useMapEvent('click', props.addCoordinate);

  return (
    <>
      <Polygon
        positions={props.polygon}
        eventHandlers={{
          add: addPolygonEventHandler,
        }}
      />
      {props.otherPolygons.map((polygon, index) => (
        <Polygon key={index} positions={polygon} color={'#888'} />
      ))}
    </>
  );
};

export default PolygonMap;
