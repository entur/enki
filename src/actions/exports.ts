import { UttuQuery } from 'api';
import { exportMutation } from 'api/uttu/mutations';
import { getExportByIdQuery, getExportsQuery } from 'api/uttu/queries';
import { showErrorNotification } from 'actions/notification';
import { getIntl } from 'i18n';
import { Export, toPayload } from 'model/Export';
import { Dispatch } from 'redux';
import { GlobalState } from 'reducers';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { sentryCaptureException } from 'store';

export const REQUEST_EXPORTS = 'REQUEST_EXPORTS';
export const RECEIVE_EXPORTS = 'RECEIVE_EXPORTS';

export const REQUEST_EXPORT = 'REQUEST_EXPORT';
export const RECEIVE_EXPORT = 'RECEIVE_EXPORT';

export const SAVE_EXPORT = 'SAVE_EXPORT';
export const SAVED_EXPORT = 'SAVED_EXPORT';

const requestExportsActionCreator = () => ({
  type: REQUEST_EXPORTS,
});

const receiveExportsActionCreator = (exports: Export[]) => ({
  type: RECEIVE_EXPORTS,
  exports,
});

const receiveExportActionCreator = (receivedExport: Export) => ({
  type: RECEIVE_EXPORT,
  export: receivedExport,
});

export const loadExports =
  () =>
  async (dispatch: Dispatch<GlobalState>, getState: () => GlobalState) => {
    dispatch(requestExportsActionCreator());

    const activeProvider = getState().providers.active?.code ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;
    const intl = getIntl(getState());

    try {
      const data = await UttuQuery(
        uttuApiUrl,
        activeProvider,
        getExportsQuery,
        {
          historicDays: 365,
        },
        await getState().auth.getAccessToken()
      );
      dispatch(receiveExportsActionCreator(data.exports));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage('exportsLoadExportsErrorHeader'),
          intl.formatMessage(
            'exportsLoadExportsErrorMessage',
            getInternationalizedUttuError(intl, e as Error)
          )
        )
      );
      sentryCaptureException(e);
    }
  };

export const loadExportById =
  (id: string) =>
  async (dispatch: Dispatch<GlobalState>, getState: () => GlobalState) => {
    const activeProvider = getState().providers.active?.code ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;
    const intl = getIntl(getState());

    try {
      const data = await UttuQuery(
        uttuApiUrl,
        activeProvider,
        getExportByIdQuery,
        { id },
        await getState().auth.getAccessToken()
      );
      dispatch(receiveExportActionCreator(data.export));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage('exportsLoadExportByIdErrorHeader'),
          intl.formatMessage(
            'exportsLoadExportByIdErrorMessage',
            getInternationalizedUttuError(intl, e as Error)
          )
        )
      );
      sentryCaptureException(e);
    }
  };

export const saveExport =
  (theExport: Export) =>
  async (dispatch: Dispatch<GlobalState>, getState: () => GlobalState) => {
    const activeProvider = getState().providers.active?.code ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;
    const intl = getIntl(getState());

    try {
      await UttuQuery(
        uttuApiUrl,
        activeProvider,
        exportMutation,
        {
          input: toPayload(theExport),
        },
        await getState().auth.getAccessToken()
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage('exportsSaveExportErrorHeader'),
          intl.formatMessage(
            'exportsSaveExportErrorMessage',
            getInternationalizedUttuError(intl, e as Error)
          )
        )
      );
      sentryCaptureException(e);
    }
  };
