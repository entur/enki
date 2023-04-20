import { UttuQuery } from 'api';
import { getProvidersQuery } from 'api/uttu/queries';
import Provider from 'model/Provider';
import { mutateCodespace, mutateProvider } from 'api/uttu/mutations';
import { showErrorNotification } from './notification';
import { getStyledUttuError, UttuError } from 'helpers/uttu';
import { AppThunk, sentryCaptureException } from 'app/store';

import {
  FAILED_RECEIVING_PROVIDERS,
  RECEIVE_PROVIDERS,
  SET_ACTIVE_PROVIDER,
} from './constants';
import { IntlShape } from 'react-intl';

const receiveProviders = (
  providers: Provider[],
  activeCode?: string | null
) => ({
  type: RECEIVE_PROVIDERS,
  payload: {
    providers,
    activeCode,
  },
});

const failedReceivingProviders = { type: FAILED_RECEIVING_PROVIDERS };

export type SetActiveProviderAction = {
  type: typeof SET_ACTIVE_PROVIDER;
  provider: Provider;
};

export const setActiveProvider = (
  provider: Provider
): SetActiveProviderAction => ({
  type: SET_ACTIVE_PROVIDER,
  provider,
});

export const getProviders = (): AppThunk => async (dispatch, getState) => {
  return UttuQuery(
    getState().config.uttuApiUrl,
    'providers',
    getProvidersQuery,
    {},
    await getState().auth.getAccessToken()
  )
    .then((data) => {
      const activeCode = window.localStorage.getItem('ACTIVE_PROVIDER');
      dispatch(receiveProviders(data.providers, activeCode));
      return Promise.resolve();
    })
    .catch((e) => {
      dispatch(failedReceivingProviders);
      return Promise.reject();
    });
};

export const saveProvider =
  (provider: Provider, intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    const { codespace, ...providerWithoutCodespace } = provider;

    try {
      await UttuQuery(
        getState().config.uttuApiUrl,
        'providers',
        mutateCodespace,
        { input: provider.codespace },
        await getState().auth.getAccessToken()
      );

      await UttuQuery(
        getState().config.uttuApiUrl,
        'providers',
        mutateProvider,
        {
          input: {
            ...providerWithoutCodespace,
            codespaceXmlns: provider.codespace?.xmlns,
          },
        },
        await getState().auth.getAccessToken()
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'saveProviderError' }),
          getStyledUttuError(
            e as UttuError,
            intl.formatMessage({ id: 'saveProviderError' }),
            intl.formatMessage({ id: 'saveProviderErrorFallback' })
          )
        )
      );
      sentryCaptureException(e);
    }
  };
