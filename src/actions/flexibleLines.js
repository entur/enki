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
import { getUttuError } from '../helpers/uttu';

export const REQUEST_FLEXIBLE_LINES = 'REQUEST_FLEXIBLE_LINES';
export const RECEIVE_FLEXIBLE_LINES = 'RECEIVE_FLEXIBLE_LINES';

export const REQUEST_FLEXIBLE_LINE = 'REQUEST_FLEXIBLE_LINE';
export const RECEIVE_FLEXIBLE_LINE = 'RECEIVE_FLEXIBLE_LINE';

const requestFlexibleLinesActionCreator = () => ({
  type: REQUEST_FLEXIBLE_LINES
});

const receiveFlexibleLinesActionCreator = lines => ({
  type: RECEIVE_FLEXIBLE_LINES,
  lines
});

const requestFlexibleLineActionCreator = () => ({
  type: REQUEST_FLEXIBLE_LINE
});

const receiveFlexibleLineActionCreator = line => ({
  type: RECEIVE_FLEXIBLE_LINE,
  line
});

export const loadFlexibleLines = () => async (dispatch, getState) => {
  dispatch(requestFlexibleLinesActionCreator());

  try {
    const data = await UttuQuery(getState().providers.active, getFlexibleLinesQuery, {});
    const flexibleLines = data.flexibleLines.map(fl => new FlexibleLine(fl));
    dispatch(receiveFlexibleLinesActionCreator(flexibleLines));
  } catch (e) {
    dispatch(
      showErrorNotification(
        'Laste linjer',
        `En feil oppstod under lastingen av linjene: ${getUttuError(e)}`
      )
    );
    throw e;
  }
};

export const loadFlexibleLineById = id => async (dispatch, getState) => {
  dispatch(requestFlexibleLineActionCreator());

  try {
    const data = await UttuQuery(getState().providers.active, getFlexibleLineByIdQuery, { id });
    dispatch(receiveFlexibleLineActionCreator(new FlexibleLine(data.flexibleLine)));
  } catch (e) {
    dispatch(
      showErrorNotification(
        'Laste linje',
        `En feil oppstod under lastingen av linjen: ${getUttuError(e)}`
      )
    );
    throw e;
  }
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
          `En feil oppstod under lagringen av linjen: ${getUttuError(e)}`
        )
      );
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
          `En feil oppstod under slettingen av linjen: ${getUttuError(e)}`
        )
      );
      return Promise.reject();
    });
};
