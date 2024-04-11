import { SandboxComponent } from '../../config/SandboxFeature';
import { TestProps } from './types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { SecondaryButton } from '@entur/button';

const DEFAULT_ZOOM_LEVEL = 14;

const DEFAULT_CENTER = {
  lat: 59.91,
  lng: 10.76,
};

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export const Test: SandboxComponent<TestProps> = ({ quayRef, onClick }) => {
  const [position, setPosition] = useState<LatLngExpression | undefined>();

  useEffect(() => {
    const getQuayPosition = async () => {
      const response = await fetch(
        'https://api.entur.io/stop-places/v1/read/quays/' + quayRef,
      );
      const quay = await response.json();
      setPosition({
        lat: quay.centroid.location.latitude,
        lng: quay.centroid.location.longitude,
      });
    };
    if (quayRef) {
      getQuayPosition();
    }
  }, [quayRef]);

  return (
    <div style={{ height: '200px' }}>
      <MapContainer
        className="map"
        style={{ width: '100%', height: '200px' }}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM_LEVEL}
      >
        <ChangeView
          center={position || DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM_LEVEL}
        />
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker position={position}>
            <Popup>
              <SecondaryButton onClick={() => onClick(position)}>
                Click me
              </SecondaryButton>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
