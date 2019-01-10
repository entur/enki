import { UttuQuery } from '../graphql';
import {
  getFlexibleLineByIdQuery,
  getFlexibleLinesQuery
} from '../graphql/uttu/queries';
import { FlexibleLine } from '../model';
import {
  showErrorNotification,
  showSuccessNotification
} from '../components/Notification/actions';
import {
  deleteFlexibleLine,
  flexibleLineMutation
} from '../graphql/uttu/mutations';

export const REQUEST_FLEXIBLE_LINES = 'REQUEST_FLEXIBLE_LINES';
export const RECEIVE_FLEXIBLE_LINES = 'RECEIVE_FLEXIBLE_LINES';

const requestFlexibleLines = () => ({
  type: REQUEST_FLEXIBLE_LINES
});

const receiveFlexibleLines = lines => ({
  type: RECEIVE_FLEXIBLE_LINES,
  lines
});

export const loadFlexibleLines = () => (dispatch, getState) => {
  dispatch(requestFlexibleLines());

  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, getFlexibleLinesQuery, {})
    .then(data => {
      const flexibleLines = data.flexibleLines.map(fl => new FlexibleLine(fl));
      dispatch(receiveFlexibleLines(flexibleLines));
      return Promise.resolve(flexibleLines);
    })
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Laste linjer',
          'En feil oppstod under lastingen av linjene.'
        )
      );
      console.log(e);
      return Promise.reject();
    });
};

export const loadFlexibleLineById = id => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, getFlexibleLineByIdQuery, { id })
    .then(data => Promise.resolve(new FlexibleLine(data.flexibleLine)))
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Laste linje',
          'En feil oppstod under lastingen av linjen.'
        )
      );
      console.log(e);
      return Promise.reject();
    });
};

export const saveFlexibleLine = flexibleLine => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, flexibleLineMutation, {
    input: flexibleLine.toPayload()
  })
    .then(() => {
      dispatch(showSuccessNotification('Lagre linje', 'Linjen ble lagret.'));
      return Promise.resolve();
    })
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Lagre linje',
          'En feil oppstod under lagringen av linjen.'
        )
      );
      console.log(e);
      return Promise.reject();
    });
};

export const deleteFlexibleLineById = id => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, deleteFlexibleLine, { id })
    .then(() => {
      dispatch(showSuccessNotification('Slette linje', 'Linjen ble slettet.'));
      return Promise.resolve();
    })
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Slette linje',
          'En feil oppstod under slettingen av linjen.'
        )
      );
      console.log(e);
      return Promise.reject();
    });
};
