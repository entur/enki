import { UttuQuery } from 'api';
import { getProvidersQuery } from 'api/uttu/queries';
import Provider from 'model/Provider';
import { Dispatch } from 'redux';
import { GlobalState } from 'reducers';
import { mutateCodespace, mutateProvider } from 'api/uttu/mutations';
import { showErrorNotification } from './notification';
import { getStyledUttuError } from 'helpers/uttu';
import { sentryCaptureException } from 'store';
import { getIntl } from 'i18n';

export const RECEIVE_PROVIDERS = 'RECEIVE_PROVIDERS';
export const FAILED_RECEIVING_PROVIDERS = 'FAILED_RECEIVING_PROVIDERS';

export const SET_ACTIVE_PROVIDER = 'SET_ACTIVE_PROVIDER';

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

export const getProviders =
  () =>
  async (dispatch: Dispatch<GlobalState>, getState: () => GlobalState) => {
    return UttuQuery(
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
  (provider: Provider) =>
  async (dispatch: Dispatch<GlobalState>, getState: () => GlobalState) => {
    const intl = getIntl(getState());
    const { codespace, ...providerWithoutCodespace } = provider;

    try {
      await UttuQuery(
        'providers',
        mutateCodespace,
        { input: provider.codespace },
        await getState().auth.getAccessToken()
      );

      await UttuQuery(
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
          intl.formatMessage('saveProviderError'),
          getStyledUttuError(
            e as any,
            intl.formatMessage('saveProviderError'),
            intl.formatMessage('saveProviderErrorFallback')
          )
        )
      );
      sentryCaptureException(e);
    }
  };
