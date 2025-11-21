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

const AuthenticatedTileLayerComponent = createTileLayerComponent<
  AuthenticatedTileLayerBase,
  AuthenticatedTileLayerBaseOptions
>((props, context) => {
  const { url } = props;
  const layer = new AuthenticatedTileLayerBase(url, props);
  return createElementObject(layer, context);
});

export const AuthenticatedTileLayer: FeatureComponent<TileLayer> = (
  props: TileLayer,
) => {
  const isAuthenticated: boolean | undefined = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const getAccessToken: (() => Promise<string>) | undefined = useSelector(
    (state: RootState) => state.auth.getAccessToken,
  );

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
