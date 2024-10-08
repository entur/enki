import { MapContainer, TileLayer } from 'react-leaflet';
import './styles.scss';

const DEFAULT_ZOOM_LEVEL = 14;

const DEFAULT_CENTER = {
  lat: 59.91,
  lng: 10.76,
};

type Props = {
  children: React.ReactElement;
  zoomControl?: boolean;
  doubleClickZoom?: boolean;
};

const DefaultMapContainer = ({
  children,
  zoomControl = true,
  doubleClickZoom = true,
}: Props) => {
  return (
    <MapContainer
      className="map"
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM_LEVEL}
      zoomControl={zoomControl}
      doubleClickZoom={doubleClickZoom}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

export default DefaultMapContainer;
