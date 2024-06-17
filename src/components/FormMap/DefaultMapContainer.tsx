import { MapContainer, TileLayer } from 'react-leaflet';
import './styles.scss';

const DEFAULT_ZOOM_LEVEL = 14;

const DEFAULT_CENTER = {
  lat: 59.91,
  lng: 10.76,
};

type Props = {
  children: React.ReactElement;
};

const DefaultMapContainer = (props: Props) => {
  return (
    <MapContainer
      className="map"
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM_LEVEL}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.children}
    </MapContainer>
  );
};

export default DefaultMapContainer;
