import { UttuQuery } from '../graphql';
import {deleteNetwork, networkMutation} from '../graphql/uttu/mutations';
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
      const networks = data.networks.map(n => new Network(n));
      dispatch(receiveNetworks(networks));
      return Promise.resolve(networks);
    })
    .catch(() => {
      dispatch(
        showErrorNotification(
          'Laste nettverk',
          'En feil oppstod under lastingen av nettverkene.'
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
          'Laste nettverk',
          'En feil oppstod under lastingen av nettverket.'
        )
      );
      return Promise.reject();
    });
};

export const saveNetwork = network => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, networkMutation, { input: network })
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

export const deleteNetworkById = id => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, deleteNetwork, { id })
    .then(() => {
      dispatch(
        showSuccessNotification('Slette nettverk', 'Nettverket ble slettet.')
      );
      return Promise.resolve();
    })
    .catch(() => {
      dispatch(
        showErrorNotification(
          'Slette nettverk',
          'En feil oppstod under slettingen av nettverket.'
        )
      );
      return Promise.reject();
    });
};
