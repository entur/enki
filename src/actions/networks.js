import { UttuQuery } from 'graphql';
import { deleteNetwork, networkMutation } from 'graphql/uttu/mutations';
import { getNetworkByIdQuery, getNetworksQuery } from 'graphql/uttu/queries';
import { Network } from 'model';
import {
  showErrorNotification,
  showSuccessNotification
} from 'components/Notification/actions';
import { getStyledUttuError } from 'helpers/uttu';

export const REQUEST_NETWORKS = 'REQUEST_NETWORKS';
export const RECEIVE_NETWORKS = 'RECEIVE_NETWORKS';

export const REQUEST_NETWORK = 'REQUEST_NETWORK';
export const RECEIVE_NETWORK = 'RECEIVE_NETWORK';

export const SAVE_NETWORK = 'SAVE_NETWORK';
export const SAVED_NETWORK = 'SAVED_NETWORK';

export const DELETE_NETWORK = 'DELETE_NETWORK';
export const DELETED_NETWORK = 'DELETED_NETWORK';

const requestNetworksActionCreator = () => ({
  type: REQUEST_NETWORKS
});

const requestNetworkActionCreator = () => ({
  type: REQUEST_NETWORK
});

const receiveNetworksActionCreator = networks => ({
  type: RECEIVE_NETWORKS,
  networks
});

const receiveNetworkActionCreator = network => ({
  type: RECEIVE_NETWORK,
  network
});

const saveNetworkActionCreator = () => ({
  type: SAVE_NETWORK
});

const savedNetworkActionCreator = () => ({
  type: SAVED_NETWORK
});

const deleteNetworkActionCreator = () => ({
  type: DELETE_NETWORK
});

const deletedNetworkActionCreator = id => ({
  type: DELETED_NETWORK,
  id
});

export const loadNetworks = () => async (dispatch, getState) => {
  dispatch(requestNetworksActionCreator());

  try {
    const data = await UttuQuery(
      getState().providers.active,
      getNetworksQuery,
      {}
    );
    const networks = data.networks.map(n => new Network(n));
    dispatch(receiveNetworksActionCreator(networks));
  } catch (e) {
    dispatch(
      showErrorNotification(
        'Laste nettverk',
        getStyledUttuError(
          e,
          'En feil oppstod under lastingen av nettverkene',
          'Prøv igjen senere.'
        )
      )
    );
    throw e;
  }
};

export const loadNetworkById = id => async (dispatch, getState) => {
  dispatch(requestNetworkActionCreator());

  try {
    const data = await UttuQuery(
      getState().providers.active,
      getNetworkByIdQuery,
      { id }
    );
    dispatch(receiveNetworkActionCreator(new Network(data.network)));
  } catch (e) {
    dispatch(
      showErrorNotification(
        'Laste nettverk',
        getStyledUttuError(
          e,
          'En feil oppstod under lastingen av nettverket',
          'Prøv igjen senere.'
        )
      )
    );
    throw e;
  }
};

export const saveNetwork = network => async (dispatch, getState) => {
  dispatch(saveNetworkActionCreator());

  try {
    await UttuQuery(getState().providers.active, networkMutation, {
      input: network
    });
    dispatch(savedNetworkActionCreator());
    dispatch(
      showSuccessNotification('Lagre nettverk', 'Nettverket ble lagret.')
    );
  } catch (e) {
    dispatch(savedNetworkActionCreator(null));
    dispatch(
      showErrorNotification(
        'Lagre nettverk',
        getStyledUttuError(
          e,
          'En feil oppstod under lagringen av nettverket',
          'Prøv igjen senere.'
        )
      )
    );
    throw e;
  }
};

export const deleteNetworkById = id => async (dispatch, getState) => {
  dispatch(deleteNetworkActionCreator());

  try {
    await UttuQuery(getState().providers.active, deleteNetwork, { id });
    dispatch(deletedNetworkActionCreator(id));
    dispatch(
      showSuccessNotification('Slette nettverk', 'Nettverket ble slettet.')
    );
  } catch (e) {
    dispatch(deletedNetworkActionCreator());
    dispatch(
      showErrorNotification(
        'Slette nettverk',
        getStyledUttuError(e, 'En feil oppstod under slettingen av nettverket')
      )
    );
    throw e;
  }
};
