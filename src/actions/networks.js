import { UttuQuery } from '../graphql';
import { mutateNetwork } from '../graphql/uttu/mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from '../components/Notification/actions';

export const CREATE_NETWORK = 'CREATE_NETWORK';
export const UPDATE_NETWORK = 'UPDATE_NETWORK';

const createNetwork = network => ({
  type: CREATE_NETWORK,
  network
});

const updateNetwork = network => ({
  type: UPDATE_NETWORK,
  network
});

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
