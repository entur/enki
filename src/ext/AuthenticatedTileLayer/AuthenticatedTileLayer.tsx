import { FeatureComponent } from '@entur/react-component-toggle';
import {
  createElementObject,
  createTileLayerComponent,
} from '@react-leaflet/core';
import { useSelector } from 'react-redux';
import { TileLayer } from '../../config/config';
import { RootState } from '../../store/store';
import {
  AuthenticatedTileLayerBase,
  AuthenticatedTileLayerBaseOptions,
} from './AuthenticatedTileLayerBase';
import { useAuth } from '../../auth/auth';

/**
 * Wraps the custom AuthenticatedTileLayerBase class in a React-Leaflet
 * compatible component. Instantiates the authenticated tile layer with
 * the provided URL and options, then returns it as a React-Leaflet element.
 */
const AuthenticatedTileLayerComponent = createTileLayerComponent<
  AuthenticatedTileLayerBase,
  AuthenticatedTileLayerBaseOptions
>((props, context) => {
  const { url } = props;
  const layer = new AuthenticatedTileLayerBase(url, props);
  return createElementObject(layer, context);
});

/**
 * Conditionally renders the authenticated tile layer only when the user
 * is logged in and a valid access-token provider is available. Ensures
 * all tile requests include a bearer token via getAccessToken.
 */
export const AuthenticatedTileLayer: FeatureComponent<TileLayer> = (
  props: TileLayer,
) => {
  const { isAuthenticated, getAccessToken } = useAuth();

  return (
    isAuthenticated &&
    getAccessToken &&
    props.url && (
      <AuthenticatedTileLayerComponent
        getAccessToken={getAccessToken}
        tms={props.tms === true}
        url={props.url}
        attribution={props.attribution}
      />
    )
  );
};
