import { MapContainer, TileLayer } from 'react-leaflet';
import './styles.scss';
import { TileLayerConfig } from '../../config/config';
import { useConfig } from '../../config/ConfigContext';

const DEFAULT_ZOOM_LEVEL = 14;
const DEFAULT_CENTER: [number, number] = [59.91, 10.76];
export const DEFAULT_OSM_TILE: TileLayerConfig = {
  name: 'OpenStreetMap',
  url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
};

type Props = {
  children: React.ReactElement;
  zoomControl?: boolean;
  doubleClickZoom?: boolean;
};

const FormMapContainer = ({
  children,
  zoomControl = true,
  doubleClickZoom = true,
}: Props) => {
  const { mapConfig } = useConfig();
  const isCustomTileToBeUsed =
    mapConfig?.tileLayer?.url && mapConfig?.tileLayer?.attribution;

  const tileUrl = isCustomTileToBeUsed
    ? (mapConfig?.tileLayer?.url as string)
    : DEFAULT_OSM_TILE.url;
  const tileAttribution = isCustomTileToBeUsed
    ? (mapConfig?.tileLayer?.attribution as string)
    : DEFAULT_OSM_TILE.attribution;
  const center = mapConfig?.center || DEFAULT_CENTER;
  const zoom = mapConfig?.zoom || DEFAULT_ZOOM_LEVEL;

  return (
    <MapContainer
      className="map"
      center={center}
      zoom={zoom}
      zoomControl={zoomControl}
      doubleClickZoom={doubleClickZoom}
    >
      <TileLayer attribution={tileAttribution} url={tileUrl} />
      {children}
    </MapContainer>
  );
};

export default FormMapContainer;
