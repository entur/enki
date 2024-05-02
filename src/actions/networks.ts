import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import { UttuQuery } from 'api';
import { deleteNetwork, networkMutation } from 'api/uttu/mutations';
import { getNetworkByIdQuery, getNetworksQuery } from 'api/uttu/queries';
import { AppThunk, sentryCaptureException } from 'store/store';
import { UttuError, getStyledUttuError } from 'helpers/uttu';
import { Network } from 'model/Network';
import { RECEIVE_NETWORK, RECEIVE_NETWORKS } from './constants';

const receiveNetworksActionCreator = (networks: Network[]) => ({
  type: RECEIVE_NETWORKS,
  networks,
});

const receiveNetworkActionCreator = (network: Network) => ({
  type: RECEIVE_NETWORK,
  network,
});

export const loadNetworks = (): AppThunk => async (dispatch, getState) => {
  try {
    const data = await UttuQuery(
      getState().config.uttuApiUrl,
      getState().userContext.activeProviderCode ?? '',
      getNetworksQuery,
      {},
      await getState().auth.getAccessToken(),
    );
    dispatch(receiveNetworksActionCreator(data.networks));
    return data.networks;
  } catch (e) {
    dispatch(
      showErrorNotification(
        'Laste nettverk',
        getStyledUttuError(
          e as UttuError,
          'En feil oppstod under lastingen av nettverkene',
          'Prøv igjen senere.',
        ),
      ),
    );
    sentryCaptureException(e);
  }
};

export const loadNetworkById =
  (id: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const data = await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        getNetworkByIdQuery,
        { id },
        await getState().auth.getAccessToken(),
      );
      dispatch(receiveNetworkActionCreator(data.network));
    } catch (e) {
      dispatch(
        showErrorNotification(
          'Laste nettverk',
          getStyledUttuError(
            e as UttuError,
            'En feil oppstod under lastingen av nettverket',
            'Prøv igjen senere.',
          ),
        ),
      );
      sentryCaptureException(e);
    }
  };

export const saveNetwork =
  (network: Network, showConfirm = true): AppThunk =>
  async (dispatch, getState) => {
    try {
      await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        networkMutation,
        {
          input: network,
        },
        await getState().auth.getAccessToken(),
      );
      if (showConfirm) {
        dispatch(
          showSuccessNotification('Lagre nettverk', 'Nettverket ble lagret.'),
        );
      }
    } catch (e) {
      dispatch(
        showErrorNotification(
          'Lagre nettverk',
          getStyledUttuError(
            e as UttuError,
            'En feil oppstod under lagringen av nettverket',
            'Prøv igjen senere.',
          ),
        ),
      );
      sentryCaptureException(e);
    }
  };

export const deleteNetworkById =
  (id: string | undefined): AppThunk =>
  async (dispatch, getState) => {
    if (!id) return;

    try {
      await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        deleteNetwork,
        {
          id,
        },
        await getState().auth.getAccessToken(),
      );
      dispatch(
        showSuccessNotification('Slette nettverk', 'Nettverket ble slettet.'),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          'Slette nettverk',
          getStyledUttuError(
            e as UttuError,
            'En feil oppstod under slettingen av nettverket',
          ),
        ),
      );
      sentryCaptureException(e);
    }
  };
