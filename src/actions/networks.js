import { UttuQuery } from '../graphql';
import { mutateNetwork } from '../graphql/uttu/mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from '../components/Notification/actions';
import { Network } from '../model';
import { getNetworkByIdQuery, getNetworksQuery } from '../graphql/uttu/queries';

export const REQUEST_NETWORKS = 'REQUEST_NETWORKS';
export const RECEIVE_NETWORKS = 'RECEIVE_NETWORKS';

const requestNetworks = () => ({
  type: REQUEST_NETWORKS
});

const receiveNetworks = networks => ({
  type: RECEIVE_NETWORKS,
  networks
});

export const loadNetworks = () => (dispatch, getState) => {
  dispatch(requestNetworks());

  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, getNetworksQuery, {})
    .then(data => {
      const networks = data.networks.map(d => new Network(d));
      dispatch(receiveNetworks(networks));
      return Promise.resolve(networks);
    })
    .catch(() => {
      dispatch(
        showErrorNotification(
          'Hente nettverk',
          'En feil oppstod under hentingen av nettverkene.'
        )
      );
      return Promise.reject();
    });
};

export const loadNetworkById = id => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, getNetworkByIdQuery, { id })
    .then(data => Promise.resolve(new Network(data.network)))
    .catch(() => {
      dispatch(
        showErrorNotification(
          'Redigere nettverk',
          'Klarte ikke å laste inn nettverket for redigering.'
        )
      );
      return Promise.reject();
    });
};

export const saveNetwork = network => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, mutateNetwork, { input: network })
    .then(() => {
      dispatch(
        showSuccessNotification('Lagre nettverk', 'Nettverket ble lagret.')
      );
      return Promise.resolve();
    })
    .catch(() => {
      dispatch(
        showErrorNotification(
          'Lagre nettverk',
          'En feil oppstod under lagringen av nettverket.'
        )
      );
      return Promise.reject();
    });
};
