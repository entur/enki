import { UttuQuery } from 'api';
import {
  getFlexibleLineByIdQuery,
  getlineByIdQuery,
  getFlexibleLinesQuery,
} from 'api/uttu/queries';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import {
  deleteFlexibleLine,
  deleteline,
  flexibleLineMutation,
  lineMutation,
} from 'api/uttu/mutations';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { getIntl } from 'i18n';
import FlexibleLine, { flexibleLineToPayload } from 'model/FlexibleLine';
import { Dispatch } from 'react';
import { GlobalState } from 'reducers';
import { SetActiveProviderAction } from 'actions/providers';
import { sentryCaptureException } from 'store';

export const RECEIVE_FLEXIBLE_LINES = 'RECEIVE_FLEXIBLE_LINES';
export const RECEIVE_FLEXIBLE_LINE = 'RECEIVE_FLEXIBLE_LINE';

type ReceiveFlexibleLinesAction = {
  type: typeof RECEIVE_FLEXIBLE_LINES;
  lines: FlexibleLine[];
};

type ReceiveFlexibleLineAction = {
  type: typeof RECEIVE_FLEXIBLE_LINE;
  line: FlexibleLine;
};

export type FlexibleLinesAction =
  | SetActiveProviderAction
  | ReceiveFlexibleLineAction
  | ReceiveFlexibleLinesAction;

const receiveFlexibleLinesActionCreator = (
  lines: FlexibleLine[]
): ReceiveFlexibleLinesAction => ({
  type: RECEIVE_FLEXIBLE_LINES,
  lines,
});

const receiveFlexibleLineActionCreator = (
  line: FlexibleLine
): ReceiveFlexibleLineAction => ({
  type: RECEIVE_FLEXIBLE_LINE,
  line,
});

export const loadFlexibleLines = () => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  try {
    const activeProvider = getState().providers.active?.code ?? '';
    const { flexibleLines } = await UttuQuery(
      activeProvider,
      getFlexibleLinesQuery,
      {},
      await getState().auth.getAccessToken()
    );
    dispatch(receiveFlexibleLinesActionCreator(flexibleLines));
  } catch (e) {
    const intl = getIntl(getState());
    dispatch(
      showErrorNotification(
        intl.formatMessage('loadLinesErrorHeader'),
        intl.formatMessage(
          'loadLinesErrorMessage',
          getInternationalizedUttuError(intl, e)
        )
      )
    );
    sentryCaptureException(e);
  }
};

export const loadFlexibleLineById = (
  id: string,
  isFlexibleLine: boolean
) => async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
  try {
    const queryById = isFlexibleLine
      ? getFlexibleLineByIdQuery
      : getlineByIdQuery;

    const { line, flexibleLine } = await UttuQuery(
      getState().providers.active?.code ?? '',
      queryById,
      {
        id,
      },
      await getState().auth.getAccessToken()
    );

    dispatch(receiveFlexibleLineActionCreator(flexibleLine ?? line ?? {}));
  } catch (e) {
    const intl = getIntl(getState());
    dispatch(
      showErrorNotification(
        intl.formatMessage('loadLineByIdErrorHeader'),
        intl.formatMessage(
          'loadLineByIdErrorMessage',
          getInternationalizedUttuError(intl, e)
        )
      )
    );
    sentryCaptureException(e);
  }
};

export const saveFlexibleLine = (flexibleLine: FlexibleLine) => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  const activeProvider = getState().providers.active?.code ?? '';
  const intl = getIntl(getState());
  const isNewLine = flexibleLine.id === undefined;
  const mutation = flexibleLine.flexibleLineType
    ? flexibleLineMutation
    : lineMutation;

  const { header, message } = isNewLine
    ? {
        header: intl.formatMessage('modalSaveLineSuccessHeader'),
        message: `${flexibleLine.name} ${intl.formatMessage(
          'modalSaveLineSuccessMessage'
        )}`,
      }
    : {
        header: intl.formatMessage('saveLineSuccessHeader'),
        message: intl.formatMessage('saveLineSuccessMessage'),
      };

  try {
    await UttuQuery(
      activeProvider,
      mutation,
      {
        input: flexibleLineToPayload(flexibleLine),
      },
      await getState().auth.getAccessToken()
    );
    dispatch(showSuccessNotification(header, message, isNewLine));
  } catch (e) {
    dispatch(
      showErrorNotification(
        intl.formatMessage('saveLineErrorHeader'),
        intl.formatMessage(
          'saveLineErrorMessage',
          getInternationalizedUttuError(intl, e)
        )
      )
    );
    sentryCaptureException(e);
    throw e;
  }
};

export const deleteLine = (flexibleLine: FlexibleLine) => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  const { id, flexibleLineType } = flexibleLine;
  const activeProvider = getState().providers.active?.code ?? '';
  const intl = getIntl(getState());
  const deleteQuery = flexibleLineType ? deleteFlexibleLine : deleteline;

  try {
    await UttuQuery(
      activeProvider,
      deleteQuery,
      { id },
      await getState().auth.getAccessToken()
    );
    dispatch(
      showSuccessNotification(
        intl.formatMessage('deleteLineSuccessHeader'),
        intl.formatMessage('deleteLineSuccessMessage')
      )
    );
  } catch (e) {
    dispatch(
      showErrorNotification(
        intl.formatMessage('deleteLineErrorHeader'),
        intl.formatMessage(
          'deleteLineErrorMessage',
          getInternationalizedUttuError(intl, e)
        )
      )
    );
    sentryCaptureException(e);
  }
};
