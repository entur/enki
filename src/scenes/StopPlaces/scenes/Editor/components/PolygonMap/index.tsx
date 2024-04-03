import { FloatingButton } from '@entur/button';
import { UndoIcon } from '@entur/icons';
import { LatLngTuple, LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { useCallback } from 'react';
import {
  MapContainer,
  Polygon,
  TileLayer,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import './styles.scss';

type Props = {
  addCoordinate: (e: LeafletMouseEvent) => void;
  polygon: LatLngTuple[];
  otherPolygons: LatLngTuple[][];
  undo: () => void;
};

const DEFAULT_ZOOM_LEVEL = 14;

const DEFAULT_CENTER = {
  lat: 59.91,
  lng: 10.76,
};

const MapContents = (props: Props) => {
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

const PolygonMap = (props: Props) => {
  return (
    <div className="map-container eds-contrast">
      <MapContainer
        className="map"
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM_LEVEL}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapContents {...props} />
      </MapContainer>

      <FloatingButton
        className="undo-button"
        size="small"
        aria-label="Undo"
        onClick={props.undo}
      >
        <UndoIcon />
      </FloatingButton>
    </div>
  );
};

export default PolygonMap;
