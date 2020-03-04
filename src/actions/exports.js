import { UttuQuery } from 'graphql';
import { exportMutation } from 'graphql/uttu/mutations';
import { getExportByIdQuery, getExportsQuery } from 'graphql/uttu/queries';
import { Export } from 'model';
import {
  showErrorNotification,
  showSuccessNotification
} from 'actions/notification';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { getIntl } from 'i18n';
import messages from './exports.messages';

export const REQUEST_EXPORTS = 'REQUEST_EXPORTS';
export const RECEIVE_EXPORTS = 'RECEIVE_EXPORTS';

export const REQUEST_EXPORT = 'REQUEST_EXPORT';
export const RECEIVE_EXPORT = 'RECEIVE_EXPORT';

export const SAVE_EXPORT = 'SAVE_EXPORT';
export const SAVED_EXPORT = 'SAVED_EXPORT';

const requestExportsActionCreator = () => ({
  type: REQUEST_EXPORTS
});

const receiveExportsActionCreator = exports => ({
  type: RECEIVE_EXPORTS,
  exports
});

const receiveExportActionCreator = receivedExport => ({
  type: RECEIVE_EXPORT,
  export: receivedExport
});

export const loadExports = () => async (dispatch, getState) => {
  dispatch(requestExportsActionCreator());

  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());

  try {
    const data = await UttuQuery(activeProvider, getExportsQuery, {
      historicDays: 30
    });
    const exports = data.exports.map(e => new Export(e));
    dispatch(receiveExportsActionCreator(exports));
  } catch (e) {
    dispatch(
      showErrorNotification(
        intl.formatMessage(messages.loadExportsErrorHeader),
        intl.formatMessage(messages.loadExportsErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
      )
    );
    throw e;
  }
};

export const loadExportById = id => async (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());

  try {
    const data = await UttuQuery(activeProvider, getExportByIdQuery, { id });
    dispatch(receiveExportActionCreator(new Export(data.export)));
  } catch (e) {
    dispatch(
      showErrorNotification(
        intl.formatMessage(messages.loadExportByIdErrorHeader),
        intl.formatMessage(messages.loadExportByIdErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
      )
    );
    throw e;
  }
};

export const saveExport = theExport => async (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());

  try {
    await UttuQuery(activeProvider, exportMutation, {
      input: theExport.toPayload()
    });
    dispatch(
      showSuccessNotification(
        intl.formatMessage(messages.saveExportSuccessHeader),
        intl.formatMessage(messages.saveExportSuccessMessage)
      )
    );
  } catch (e) {
    dispatch(
      showErrorNotification(
        intl.formatMessage(messages.saveExportErrorHeader),
        intl.formatMessage(messages.saveExportErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
      )
    );
    throw e;
  }
};
