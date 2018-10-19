import { UttuQuery } from '../graphql';
import { mutateNetwork } from '../graphql/uttu/mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from '../components/Notification/actions';
import { Network } from '../model';
import { getNetworksQuery } from '../graphql/uttu/queries';

export const REQUEST_NETWORKS = 'REQUEST_NETWORKS';
export const RECEIVE_NETWORKS = 'RECEIVE_NETWORKS';

export const CREATE_NETWORK = 'CREATE_NETWORK';
export const UPDATE_NETWORK = 'UPDATE_NETWORK';

const requestNetworks = () => ({
  type: REQUEST_NETWORKS
});

const receiveNetworks = networks => ({
  type: RECEIVE_NETWORKS,
  networks
});

const createNetwork = network => ({
  type: CREATE_NETWORK,
  network
});

const updateNetwork = network => ({
  type: UPDATE_NETWORK,
  network
});

export const getNetworks = () => (dispatch, getState) => {
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

export const saveNetwork = network => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, mutateNetwork, { input: network })
    .then(data => {
      const id = data.mutateNetwork.id;
      const updatedNetwork = network.withChanges({ id });
      network.id
        ? createNetwork(updatedNetwork)
        : updateNetwork(updatedNetwork);
      dispatch(
        showSuccessNotification('Lagre nettverk', 'Nettverket ble lagret.')
      );
      return Promise.resolve(updatedNetwork);
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
