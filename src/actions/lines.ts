import { UttuQuery } from 'graphql';
import {
  getFlexibleLineByIdQuery,
  getlineByIdQuery,
  getLinesQuery,
} from 'graphql/uttu/queries';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import {
  deleteFlexibleLine,
  deleteline,
  flexibleLineMutation,
  lineMutation,
} from 'graphql/uttu/mutations';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { getIntl } from 'i18n';
import Line, { lineToPayload } from 'model/Line';
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

const receiveLineActionCreator = (line: Line): ReceiveLineAction => ({
  type: RECEIVE_LINE,
  line,
});

export const loadLines = () => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  const activeProvider = getState().providers.active?.code ?? '';
  const { lines } = await UttuQuery(activeProvider, getLinesQuery);
  dispatch(receiveLinesActionCreator(lines));
};
