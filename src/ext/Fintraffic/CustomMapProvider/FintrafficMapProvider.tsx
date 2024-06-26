import { MapContainer, TileLayer } from 'react-leaflet';

const ZOOM_LEVEL = 6;

const CENTER = {
  lat: 65,
  lng: 26,
};

type Props = {
  children: React.ReactElement;
};

export const FintrafficMapProvider = (props: Props) => {
  return (
    <MapContainer className="map" center={CENTER} zoom={ZOOM_LEVEL}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://cdn.digitransit.fi/map/v2/hsl-map/{z}/{x}/{y}.png?digitransit-subscription-key=17771c2dff3e4225ae7daab22456b53e"
      />
      {props.children}
    </MapContainer>
  );
};
