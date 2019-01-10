import { UttuQuery } from '../graphql';
import { exportMutation } from '../graphql/uttu/mutations';
import { getExportByIdQuery, getExportsQuery } from '../graphql/uttu/queries';
import { Export } from '../model';
import {
  showErrorNotification,
  showSuccessNotification
} from '../components/Notification/actions';

export const REQUEST_EXPORTS = 'REQUEST_EXPORTS';
export const RECEIVE_EXPORTS = 'RECEIVE_EXPORTS';

const requestExports = () => ({
  type: REQUEST_EXPORTS
});

const receiveExports = exports => ({
  type: RECEIVE_EXPORTS,
  exports
});

export const loadExports = () => (dispatch, getState) => {
  dispatch(requestExports());

  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, getExportsQuery, { historicDays: 30 })
    .then(data => {
      const exports = data.exports.map(e => new Export(e));
      dispatch(receiveExports(exports));
      return Promise.resolve(exports);
    })
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Laste eksporter',
          'En feil oppstod under lastingen av eksportene.'
        )
      );
      console.log(e);
      return Promise.reject();
    });
};

export const loadExportById = id => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, getExportByIdQuery, { id })
    .then(data => Promise.resolve(new Export(data.export)))
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Laste eksport',
          'En feil oppstod under lastingen av eksporten.'
        )
      );
      console.log(e);
      return Promise.reject();
    });
};

export const saveExport = theExport => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, exportMutation, {
    input: theExport.toPayload()
  })
    .then(() => {
      dispatch(
        showSuccessNotification('Lagre eksport', 'Eksporten ble lagret.')
      );
      return Promise.resolve();
    })
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Lagre eksport',
          'En feil oppstod under lagringen av eksporten.'
        )
      );
      console.log(e);
      return Promise.reject();
    });
};
