import { UttuQuery } from 'api';
import { mutateCodespace, mutateProvider } from 'api/uttu/mutations';
import { getProvidersQuery } from 'api/uttu/queries';
import { AppThunk, sentryCaptureException } from 'store/store';
import { UttuError, getStyledUttuError } from 'helpers/uttu';
import Provider from 'model/Provider';
import { showErrorNotification } from './notification';

import { IntlShape } from 'react-intl';
import { FAILED_RECEIVING_PROVIDERS, RECEIVE_PROVIDERS } from './constants';

const receiveProviders = (
  providers: Provider[],
  activeCode?: string | null,
) => ({
  type: RECEIVE_PROVIDERS,
  payload: {
    providers,
    activeCode,
  },
});

const failedReceivingProviders = { type: FAILED_RECEIVING_PROVIDERS };

export const getProviders = (): AppThunk => async (dispatch, getState) => {
  return UttuQuery(
    getState().config.uttuApiUrl,
    'providers',
    getProvidersQuery,
    {},
    await getState().auth.getAccessToken(),
  )
    .then((data) => {
      dispatch(receiveProviders(data.providers));
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
        await getState().auth.getAccessToken(),
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
        await getState().auth.getAccessToken(),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'saveProviderError' }),
          getStyledUttuError(
            e as UttuError,
            intl.formatMessage({ id: 'saveProviderError' }),
            intl.formatMessage({ id: 'saveProviderErrorFallback' }),
          ),
        ),
      );
      sentryCaptureException(e);
    }
  };
