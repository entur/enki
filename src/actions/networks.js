import { UttuQuery } from '../graphql';
import { mutateNetwork } from '../graphql/uttu/mutations';

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
      alert('Network saved successfully!');
      return Promise.resolve(updatedNetwork);
    })
    .catch(ex => {
      alert('Failed to save network.');
      console.log(ex);
      return Promise.reject();
    });
};
