import { ComponentToggle } from '@entur/react-component-toggle';
import {
  MapContainer,
  LayersControl,
  ZoomControl,
  useMapEvents,
} from 'react-leaflet';
import './styles.scss';
import { useConfig } from '../../config/ConfigContext';
import { DynamicTileLayer } from './DynamicTileLayer';
import { useDispatch } from 'react-redux';
import { setActiveMapBaseLayer } from '../../auth/userContextSlice';
import { useAppSelector } from '../../store/hooks';
import { ACTIVE_MAP_BASELAYER } from '../../actions/constants';
import {
  DEFAULT_OSM_TILE,
  DEFAULT_CENTER,
  DEFAULT_ZOOM_LEVEL,
} from './mapDefaults';

type Props = {
  children: React.ReactElement;
  zoomControl?: boolean;
  doubleClickZoom?: boolean;
};

const FormMapContainer = ({
  children,
  zoomControl = false,
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
   * Hook-based component that listens to Leaflet map events.
   * Currently handles base layer changes and triggers the provided callback.
   */
  const MapEvents = () => {
    useMapEvents({
      baselayerchange: (e) => {
        handleActiveMapBaseLayerChange(e.name);
      },
    });
    return null;
  };

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
      <MapEvents />
      <ZoomControl position="bottomright" />
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
