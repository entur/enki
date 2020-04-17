import React, { createRef, useEffect, useState } from 'react';
import { Map, Polygon, TileLayer } from 'react-leaflet';
import { FloatingButton } from '@entur/button';
import { UndoIcon } from '@entur/icons';
import {
  LatLngBounds,
  LatLngLiteral,
  LatLngTuple,
  LeafletMouseEvent,
} from 'leaflet';
import './styles.scss';

type State = {
  center: LatLngLiteral;
  bounds?: LatLngBounds;
  zoom: number;
};

type Props = {
  addCoordinate: (e: LeafletMouseEvent) => void;
  polygon: LatLngTuple[];
  undo: () => void;
};

const PolygonMap = (props: Props) => {
  const [state, setState] = useState<State>({
    center: {
      lat: 59.91,
      lng: 10.76,
    },
    zoom: 14,
  });

  const map = createRef<any>();

  useEffect(() => {
    map.current.leafletElement.locate();
  }, [map]);

  const setPolygonRef = (element: any) => {
    if (element) {
      const bounds = element.leafletElement.getBounds();
      if (isBoundsValid(bounds) && bounds !== state.bounds) {
        setState({ ...state, bounds });
      }
    }
  };

  const isBoundsValid = (bounds?: LatLngBounds) => {
    if (!bounds || !bounds.isValid()) return false;
    return !bounds.getSouthWest().equals(bounds.getNorthEast());
  };

  const handleLocationFound = (e: LeafletMouseEvent) => {
    if (!state.bounds) {
      setState({ ...state, center: e.latlng });
    }
  };

  const { addCoordinate, polygon, undo } = props;
  const { center, bounds, zoom } = state;

  return (
    <div className="map-container eds-contrast">
      <Map
        className="map"
        center={[center.lat, center.lng]}
        zoom={zoom}
        bounds={bounds}
        onClick={addCoordinate}
        onLocationFound={(e: LeafletMouseEvent) => handleLocationFound(e)}
        ref={map}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon ref={(e) => setPolygonRef(e)} positions={polygon} />
      </Map>

      <FloatingButton
        className="undo-button"
        size="small"
        aria-label="Undo"
        onClick={undo}
      >
        <UndoIcon />
      </FloatingButton>
    </div>
  );
};

export default PolygonMap;
