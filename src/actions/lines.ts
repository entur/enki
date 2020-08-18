import { UttuQuery } from 'api';
import { getLinesQuery } from 'api/uttu/queries';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import { deleteFlexibleLine, deleteline } from 'api/uttu/mutations';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { getIntl } from 'i18n';
import Line from 'model/Line';
import FlexibleLine from 'model/FlexibleLine';
import { Dispatch } from 'react';
import { GlobalState } from 'reducers';
import { SetActiveProviderAction } from 'actions/providers';
import { sentryCaptureException } from 'store';

export const RECEIVE_LINES = 'RECEIVE_LINES';
export const RECEIVE_LINE = 'RECEIVE_LINE';

type ReceiveLinesAction = {
  type: typeof RECEIVE_LINES;
  lines: Line[];
};

type ReceiveLineAction = {
  type: typeof RECEIVE_LINE;
  line: Line;
};

export type LinesAction =
  | SetActiveProviderAction
  | ReceiveLineAction
  | ReceiveLinesAction;

const receiveLinesActionCreator = (lines: Line[]): ReceiveLinesAction => ({
  type: RECEIVE_LINES,
  lines,
});

export const loadLines = () => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  const activeProvider = getState().providers.active?.code ?? '';
  const { lines } = await UttuQuery(activeProvider, getLinesQuery);
  dispatch(receiveLinesActionCreator(lines));
};

export const deleteLine = (line: Line & FlexibleLine) => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  const { id, flexibleLineType } = line;
  const activeProvider = getState().providers.active?.code ?? '';
  const intl = getIntl(getState());
  const deleteQuery = flexibleLineType ? deleteFlexibleLine : deleteline;

  try {
    await UttuQuery(activeProvider, deleteQuery, { id });
    dispatch(
      showSuccessNotification(
        intl.formatMessage('flexibleLinesDeleteLineSuccessHeader'),
        intl.formatMessage('flexibleLinesDeleteLineSuccessMessage')
      )
    );
  } catch (e) {
    dispatch(
      showErrorNotification(
        intl.formatMessage('flexibleLinesDeleteLineErrorHeader'),
        intl.formatMessage(
          'flexibleLinesDeleteLineErrorMessage',
          getInternationalizedUttuError(intl, e)
        )
      )
    );
    sentryCaptureException(e);
  }
};
