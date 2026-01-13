import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import { UttuQuery } from 'api';
import { deleteNetwork, networkMutation } from 'api/uttu/mutations';
import { getNetworkByIdQuery, getNetworksQuery } from 'api/uttu/queries';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { Network } from 'model/Network';
import { IntlShape } from 'react-intl';
import { AppThunk } from 'store/store';
import { RECEIVE_NETWORK, RECEIVE_NETWORKS } from './constants';

// Action type definitions
export type ReceiveNetworksAction = {
  type: typeof RECEIVE_NETWORKS;
  networks: Network[];
};

export type ReceiveNetworkAction = {
  type: typeof RECEIVE_NETWORK;
  network: Network;
};

export type NetworksAction = ReceiveNetworksAction | ReceiveNetworkAction;

// Action creators
const receiveNetworksActionCreator = (
  networks: Network[],
): ReceiveNetworksAction => ({
  type: RECEIVE_NETWORKS,
  networks,
});

const receiveNetworkActionCreator = (
  network: Network,
): ReceiveNetworkAction => ({
  type: RECEIVE_NETWORK,
  network,
});

export const loadNetworks =
  (intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
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
          intl.formatMessage({ id: 'networksLoadNetworksErrorHeader' }),
          intl.formatMessage(
            { id: 'networksLoadNetworksErrorMessage' },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };

export const loadNetworkById =
  (id: string, intl: IntlShape): AppThunk =>
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
          intl.formatMessage({ id: 'networksLoadNetworkByIdErrorHeader' }),
          intl.formatMessage(
            { id: 'networksLoadNetworkByIdErrorMessage' },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };

export const saveNetwork =
  (network: Network, intl: IntlShape, showConfirm = true): AppThunk =>
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
          showSuccessNotification(
            intl.formatMessage({ id: 'networksSaveNetworkSuccessHeader' }),
            intl.formatMessage({ id: 'networksSaveNetworkSuccessMessage' }),
          ),
        );
      }
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'networksSaveNetworkErrorHeader' }),
          intl.formatMessage(
            { id: 'networksSaveNetworkErrorMessage' },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };

export const deleteNetworkById =
  (id: string | undefined, intl: IntlShape): AppThunk =>
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
        showSuccessNotification(
          intl.formatMessage({ id: 'networksDeleteNetworkSuccessHeader' }),
          intl.formatMessage({ id: 'networksDeleteNetworkSuccessMessage' }),
        ),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'networksDeleteNetworkErrorHeader' }),
          intl.formatMessage(
            { id: 'networksDeleteNetworkErrorMessage' },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };
