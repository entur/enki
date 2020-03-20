import { UttuQuery } from 'graphql';
import {
  getFlexibleLineByIdQuery,
  getFlexibleLinesQuery
} from 'graphql/uttu/queries';
import {
  showErrorNotification,
  showSuccessNotification
} from 'actions/notification';
import {
  deleteFlexibleLine,
  flexibleLineMutation
} from 'graphql/uttu/mutations';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { getIntl } from 'i18n';
import messages from './flexibleLines.messages';
import FlexibleLine, { flexibleLineToPayload } from 'model/FlexibleLine';
import { Dispatch } from 'react';
import { GlobalState } from 'reducers';

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
  | ReceiveFlexibleLineAction
  | ReceiveFlexibleLinesAction;

const receiveFlexibleLinesActionCreator = (
  lines: FlexibleLine[]
): ReceiveFlexibleLinesAction => ({
  type: RECEIVE_FLEXIBLE_LINES,
  lines
});

const receiveFlexibleLineActionCreator = (
  line: FlexibleLine
): ReceiveFlexibleLineAction => ({
  type: RECEIVE_FLEXIBLE_LINE,
  line
});

export const loadFlexibleLines = () => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  try {
    const data = await UttuQuery(
      getState().providers.active,
      getFlexibleLinesQuery,
      {}
    );
    const flexibleLines = data.flexibleLines;
    dispatch(receiveFlexibleLinesActionCreator(flexibleLines));
  } catch (e) {
    const intl = getIntl(getState());
    dispatch(
      showErrorNotification(
        intl.formatMessage(messages.loadLinesErrorHeader),
        intl.formatMessage(messages.loadLinesErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
      )
    );
    throw e;
  }
};

export const loadFlexibleLineById = (id: string) => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  try {
    const data = await UttuQuery(
      getState().providers.active,
      getFlexibleLineByIdQuery,
      { id }
    );

    dispatch(receiveFlexibleLineActionCreator(data.flexibleLine ?? {}));
  } catch (e) {
    const intl = getIntl(getState());
    dispatch(
      showErrorNotification(
        intl.formatMessage(messages.loadLineByIdErrorHeader),
        intl.formatMessage(messages.loadLineByIdErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
      )
    );
    throw e;
  }
};

export const saveFlexibleLine = (flexibleLine: FlexibleLine) => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());
  const isNewLine = flexibleLine.id === undefined;

  const { header, message } = isNewLine
    ? {
        header: intl.formatMessage(messages.modalSaveLineSuccessHeader),
        message: `${flexibleLine.name} ${intl.formatMessage(
          messages.modalSaveLineSuccessMessage
        )}`
      }
    : {
        header: intl.formatMessage(messages.saveLineSuccessHeader),
        message: intl.formatMessage(messages.saveLineSuccessMessage)
      };

  try {
    await UttuQuery(activeProvider, flexibleLineMutation, {
      input: flexibleLineToPayload(flexibleLine)
    });
    dispatch(showSuccessNotification(header, message, isNewLine));
  } catch (e) {
    dispatch(
      showErrorNotification(
        intl.formatMessage(messages.saveLineErrorHeader),
        intl.formatMessage(messages.saveLineErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
      )
    );
    throw e;
  }
};

export const deleteFlexibleLineById = (id: string) => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());

  try {
    await UttuQuery(activeProvider, deleteFlexibleLine, { id });
    dispatch(
      showSuccessNotification(
        intl.formatMessage(messages.deleteLineSuccessHeader),
        intl.formatMessage(messages.deleteLineSuccessMessage)
      )
    );
  } catch (e) {
    dispatch(
      showErrorNotification(
        intl.formatMessage(messages.deleteLineErrorHeader),
        intl.formatMessage(messages.deleteLineErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
      )
    );
    throw e;
  }
};
