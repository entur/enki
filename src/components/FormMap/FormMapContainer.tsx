import { ComponentToggle } from '@entur/react-component-toggle';
import { MapContainer, LayersControl } from 'react-leaflet';
import './styles.scss';
import { Tile } from '../../config/config';
import { useConfig } from '../../config/ConfigContext';
import { DynamicTileLayer } from './DynamicTileLayer';
import { useDispatch } from 'react-redux';
import { setActiveMapBaseLayer } from '../../auth/userContextSlice';
import { MapEvents } from './MapEvents';
import { useAppSelector } from '../../store/hooks';
import { useEffect } from 'react';

const DEFAULT_ZOOM_LEVEL = 14;
const DEFAULT_CENTER: [number, number] = [59.91, 10.76];
export const DEFAULT_OSM_TILE: Tile = {
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
  console.log('activeMapBaseLayer', activeMapBaseLayer);
  const defaultTiles = [DEFAULT_OSM_TILE];
  const isCustomTileToBeUsed =
    mapConfig?.tiles?.length &&
    mapConfig?.tiles[0]?.url &&
    mapConfig?.tiles[0].attribution;
  const center = mapConfig?.center || DEFAULT_CENTER;
  const zoom = mapConfig?.zoom || DEFAULT_ZOOM_LEVEL;
  /**
   * Sets the active base map layer on load or when mapConfig changes.
   * Priority:
   * 1. Saved layer from localStorage/Redux
   * 2. Default or first tile from mapConfig
   * 3. DEFAULT_OSM_TILE fallback
   */
  useEffect(() => {
    const layerBasedOnMapConfig = isCustomTileToBeUsed
      ? mapConfig?.defaultTile || mapConfig?.tiles[0]?.name
      : '';
    const activeLayer =
      activeMapBaseLayer || layerBasedOnMapConfig || DEFAULT_OSM_TILE.name;
    console.log('activeLayer', activeLayer);
    dispatch(setActiveMapBaseLayer(activeLayer));
  }, [mapConfig]);
  /**
   * Updates the active base map layer in Redux and localStorage.
   * @param activeMapBaseLayer - The selected base layer name.
   */
  const handleActiveMapBaseLayerChange = (
    activeMapBaseLayer: string | undefined,
  ) => {
    const tile = mapConfig?.tiles?.find((t) => t.name === activeMapBaseLayer);
    if (tile) {
      window.localStorage.setItem('ACTIVE_MAP_BASELAYER', tile.name!);
      dispatch(setActiveMapBaseLayer(tile.name));
    }
  };
  /**
   * Checks if a given base layer is the currently active one.
   * @param value - The name of the base layer to compare.
   * @returns True if the given layer is active, otherwise false.
   */
  const getCheckedBaseLayerByValue = (value: string): boolean => {
    console.log('🔍 Checking base layer:', { activeMapBaseLayer, value });
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
        {(mapConfig?.tiles?.length ? mapConfig.tiles : defaultTiles).map(
          (tile) => {
            return (
              <BaseLayer
                key={tile.name}
                checked={getCheckedBaseLayerByValue(tile.name)}
                name={tile.name}
              >
                {tile.component ? (
                  <ComponentToggle
                    feature={tile.componentName ?? tile.name}
                    componentProps={tile}
                  />
                ) : (
                  <DynamicTileLayer
                    name={tile.name}
                    attribution={tile.attribution}
                    url={tile.url}
                    maxZoom={tile.maxZoom}
                  />
                )}
              </BaseLayer>
            );
          },
        )}
      </LayersControl>
      {children}
    </MapContainer>
  );
};

export default FormMapContainer;
