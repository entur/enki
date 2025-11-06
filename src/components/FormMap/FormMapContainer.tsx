import { ComponentToggle } from '@entur/react-component-toggle';
import { MapContainer, LayersControl } from 'react-leaflet';
import './styles.scss';
import { TileLayer } from '../../config/config';
import { useConfig } from '../../config/ConfigContext';
import { DynamicTileLayer } from './DynamicTileLayer';
import { useDispatch } from 'react-redux';
import { setActiveMapBaseLayer } from '../../auth/userContextSlice';
import { MapEvents } from './MapEvents';
import { useAppSelector } from '../../store/hooks';
import { ACTIVE_MAP_BASELAYER, OPEN_STREET_MAP } from '../../actions/constants';

const DEFAULT_ZOOM_LEVEL = 14;
const DEFAULT_CENTER: [number, number] = [59.91, 10.76];
export const DEFAULT_OSM_TILE: TileLayer = {
  name: OPEN_STREET_MAP,
  url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
};

type Props = {
  children: React.ReactElement;
  zoomControl?: boolean;
  doubleClickZoom?: boolean;
};

interface BaseLayerProps {
  onChange?: () => boolean;
}

const FormMapContainer = ({
  children,
  zoomControl = true,
  doubleClickZoom = true,
}: Props) => {
  const { mapConfig } = useConfig();
  const activeMapBaseLayer = useAppSelector(
    (state) => state.userContext.activeMapBaseLayer,
  );
  const dispatch = useDispatch();
  const defaultTileLayers = [DEFAULT_OSM_TILE];
  const center = mapConfig?.center || DEFAULT_CENTER;
  const zoom = mapConfig?.zoom || DEFAULT_ZOOM_LEVEL;

  /**
   * Updates the active base map layer in Redux and localStorage.
   * @param activeMapBaseLayer - The selected base layer name.
   */
  const handleActiveMapBaseLayerChange = (
    activeMapBaseLayer: string | undefined,
  ) => {
    const tileLayer = mapConfig?.tileLayers?.find(
      (t) => t.name === activeMapBaseLayer,
    );
    if (tileLayer) {
      window.localStorage.setItem(ACTIVE_MAP_BASELAYER, tileLayer.name!);
      dispatch(setActiveMapBaseLayer(tileLayer.name));
    }
  };
  /**
   * Checks if a given base layer is the currently active one.
   * @param value - The name of the base layer to compare.
   * @returns True if the given layer is active, otherwise false.
   */
  const getCheckedBaseLayerByValue = (value: string): boolean => {
    return activeMapBaseLayer === value;
  };
  const { BaseLayer } = LayersControl;
  /**
   * Leaflet MapContainer with LayersControl for switching base map layers.
   * Uses DynamicTileLayer to render customizable tile sources.
   * Use MapEvents to handle storage change whenever the base layer changes.
   */
  return (
    <MapContainer
      className="map"
      center={center}
      zoom={zoom}
      zoomControl={zoomControl}
      doubleClickZoom={doubleClickZoom}
    >
      <MapEvents handleBaselayerChanged={handleActiveMapBaseLayerChange} />
      <LayersControl position="topright">
        {(mapConfig?.tileLayers?.length
          ? mapConfig.tileLayers
          : defaultTileLayers
        ).map((tileLayer) => {
          return (
            <BaseLayer
              key={tileLayer.name}
              checked={getCheckedBaseLayerByValue(tileLayer.name)}
              name={tileLayer.name}
            >
              {tileLayer.component ? (
                <ComponentToggle
                  feature={tileLayer.componentName ?? tileLayer.name}
                  componentProps={tileLayer}
                />
              ) : (
                <DynamicTileLayer
                  name={tileLayer.name}
                  attribution={tileLayer.attribution}
                  url={tileLayer.url}
                  maxZoom={tileLayer.maxZoom}
                />
              )}
            </BaseLayer>
          );
        })}
      </LayersControl>
      {children}
    </MapContainer>
  );
};

export default FormMapContainer;
