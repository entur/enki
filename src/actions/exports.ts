import { showErrorNotification } from 'actions/notification';
import { UttuQuery } from 'api';
import { exportMutation } from 'api/uttu/mutations';
import { getExportByIdQuery, getExportsQuery } from 'api/uttu/queries';
import { AppThunk } from 'store/store';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { Export, toPayload } from 'model/Export';
import { IntlShape } from 'react-intl';
import {
  requestExports,
  receiveExports,
  receiveExport,
} from '../reducers/exportsSlice';

// Re-export actions from slice
export { requestExports, receiveExports, receiveExport };

export const loadExports =
  (intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    dispatch(requestExports());

    const activeProvider = getState().userContext.activeProviderCode ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;

    try {
      const data = await UttuQuery(
        uttuApiUrl,
        activeProvider,
        getExportsQuery,
        {
          historicDays: 365,
        },
        await getState().auth.getAccessToken(),
      );
      dispatch(receiveExports(data.exports));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'exportsLoadExportsErrorHeader' }),
          intl.formatMessage(
            {
              id: 'exportsLoadExportsErrorMessage',
            },
            {
              details: getInternationalizedUttuError(intl, e as Error),
            },
          ),
        ),
      );
    }
  };

export const loadExportById =
  (id: string, intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    const activeProvider = getState().userContext.activeProviderCode ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;

    try {
      const data = await UttuQuery(
        uttuApiUrl,
        activeProvider,
        getExportByIdQuery,
        { id },
        await getState().auth.getAccessToken(),
      );
      dispatch(receiveExport(data.export));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'exportsLoadExportByIdErrorHeader' }),
          intl.formatMessage(
            {
              id: 'exportsLoadExportByIdErrorMessage',
            },
            {
              details: getInternationalizedUttuError(intl, e as Error),
            },
          ),
        ),
      );
    }
  };

export const saveExport =
  (theExport: Export, intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    const activeProvider = getState().userContext.activeProviderCode ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;

    try {
      await UttuQuery(
        uttuApiUrl,
        activeProvider,
        exportMutation,
        {
          input: toPayload(theExport),
        },
        await getState().auth.getAccessToken(),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'exportsSaveExportErrorHeader' }),
          intl.formatMessage(
            {
              id: 'exportsSaveExportErrorMessage',
            },
            {
              details: getInternationalizedUttuError(intl, e as Error),
            },
          ),
        ),
      );
    }
  };
