import { MapContainer, TileLayer } from 'react-leaflet';

const ZOOM_LEVEL = 6;

const CENTER = {
  lat: 65,
  lng: 26,
};

type Props = {
  children: React.ReactElement;
  zoomControl?: boolean;
  doubleClickZoom?: boolean;
};

export const FintrafficMapProvider = ({
  children,
  zoomControl = true,
  doubleClickZoom = true,
}: Props) => {
  return (
    <MapContainer
      className="map"
      center={CENTER}
      zoom={ZOOM_LEVEL}
      zoomControl={zoomControl}
      doubleClickZoom={doubleClickZoom}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://cdn.digitransit.fi/map/v2/hsl-map/{z}/{x}/{y}.png?digitransit-subscription-key=17771c2dff3e4225ae7daab22456b53e"
      />
      {children}
    </MapContainer>
  );
};
