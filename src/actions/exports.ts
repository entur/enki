import { UttuQuery } from 'api';
import { exportMutation } from 'api/uttu/mutations';
import { getExportByIdQuery, getExportsQuery } from 'api/uttu/queries';
import { showErrorNotification } from 'actions/notification';
import { getIntl } from 'i18n';
import { Export, toPayload } from 'model/Export';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { AppThunk, sentryCaptureException } from 'app/store';
import { RECEIVE_EXPORT, RECEIVE_EXPORTS, REQUEST_EXPORTS } from './constants';

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

export const loadExports = (): AppThunk => async (dispatch, getState) => {
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
  (id: string): AppThunk =>
  async (dispatch, getState) => {
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
  (theExport: Export): AppThunk =>
  async (dispatch, getState) => {
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
