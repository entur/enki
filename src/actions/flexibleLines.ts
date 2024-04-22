import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import { SetActiveProviderAction } from 'actions/providers';
import { UttuQuery } from 'api';
import {
  deleteFlexibleLine,
  deleteline,
  flexibleLineMutation,
  lineMutation,
} from 'api/uttu/mutations';
import {
  getFlexibleLineByIdQuery,
  getFlexibleLinesQuery,
  getlineByIdQuery,
} from 'api/uttu/queries';
import { sentryCaptureException } from 'store/store';
import { getInternationalizedUttuError } from 'helpers/uttu';
import FlexibleLine, { flexibleLineToPayload } from 'model/FlexibleLine';
import { Dispatch } from 'react';
import { IntlShape } from 'react-intl';
import { GlobalState } from 'reducers';
import { RECEIVE_FLEXIBLE_LINE, RECEIVE_FLEXIBLE_LINES } from './constants';

export type ReceiveFlexibleLinesAction = {
  type: typeof RECEIVE_FLEXIBLE_LINES;
  lines: FlexibleLine[];
};

export type ReceiveFlexibleLineAction = {
  type: typeof RECEIVE_FLEXIBLE_LINE;
  line: FlexibleLine;
};

export type FlexibleLinesAction =
  | SetActiveProviderAction
  | ReceiveFlexibleLineAction
  | ReceiveFlexibleLinesAction;

const receiveFlexibleLinesActionCreator = (
  lines: FlexibleLine[],
): ReceiveFlexibleLinesAction => ({
  type: RECEIVE_FLEXIBLE_LINES,
  lines,
});

const receiveFlexibleLineActionCreator = (
  line: FlexibleLine,
): ReceiveFlexibleLineAction => ({
  type: RECEIVE_FLEXIBLE_LINE,
  line,
});

export const loadFlexibleLines =
  (intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    try {
      const activeProvider = getState().providers.active?.code ?? '';
      const uttuApiUrl = getState().config.uttuApiUrl;
      const { flexibleLines } = await UttuQuery(
        uttuApiUrl,
        activeProvider,
        getFlexibleLinesQuery,
        {},
        await getState().auth.getAccessToken(),
      );
      dispatch(receiveFlexibleLinesActionCreator(flexibleLines));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'loadLinesErrorHeader' }),
          intl.formatMessage(
            {
              id: 'loadLinesErrorMessage',
            },
            {
              details: getInternationalizedUttuError(intl, e as Error),
            },
          ),
        ),
      );
      sentryCaptureException(e);
    }
  };

export const loadFlexibleLineById =
  (id: string, isFlexibleLine: boolean, intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    try {
      const queryById = isFlexibleLine
        ? getFlexibleLineByIdQuery
        : getlineByIdQuery;

      const uttuApiUrl = getState().config.uttuApiUrl;

      const { line, flexibleLine } = await UttuQuery(
        uttuApiUrl,
        getState().providers.active?.code ?? '',
        queryById,
        {
          id,
        },
        await getState().auth.getAccessToken(),
      );

      dispatch(receiveFlexibleLineActionCreator(flexibleLine ?? line ?? {}));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'loadLineByIdErrorHeader' }),
          intl.formatMessage(
            {
              id: 'loadLineByIdErrorMessage',
            },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
      sentryCaptureException(e);
    }
  };

export const saveFlexibleLine =
  (flexibleLine: FlexibleLine, intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    const activeProvider = getState().providers.active?.code ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;
    const isNewLine = flexibleLine.id === undefined;
    const mutation = flexibleLine.flexibleLineType
      ? flexibleLineMutation
      : lineMutation;

    const { header, message } = isNewLine
      ? {
          header: intl.formatMessage({ id: 'modalSaveLineSuccessHeader' }),
          message: `${flexibleLine.name} ${intl.formatMessage({
            id: 'modalSaveLineSuccessMessage',
          })}`,
        }
      : {
          header: intl.formatMessage({ id: 'saveLineSuccessHeader' }),
          message: intl.formatMessage({ id: 'saveLineSuccessMessage' }),
        };

    try {
      await UttuQuery(
        uttuApiUrl,
        activeProvider,
        mutation,
        {
          input: flexibleLineToPayload(flexibleLine),
        },
        await getState().auth.getAccessToken(),
      );
      dispatch(showSuccessNotification(header, message, isNewLine));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'saveLineErrorHeader' }),
          intl.formatMessage(
            {
              id: 'saveLineErrorMessage',
            },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
      sentryCaptureException(e);
      throw e;
    }
  };

export const deleteLine =
  (flexibleLine: FlexibleLine, intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    const { id, flexibleLineType } = flexibleLine;
    const activeProvider = getState().providers.active?.code ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;
    const deleteQuery = flexibleLineType ? deleteFlexibleLine : deleteline;

    try {
      await UttuQuery(
        uttuApiUrl,
        activeProvider,
        deleteQuery,
        { id },
        await getState().auth.getAccessToken(),
      );
      dispatch(
        showSuccessNotification(
          intl.formatMessage({ id: 'deleteLineSuccessHeader' }),
          intl.formatMessage({ id: 'deleteLineSuccessMessage' }),
        ),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'deleteLineErrorHeader' }),
          intl.formatMessage(
            {
              id: 'deleteLineErrorMessage',
            },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
      sentryCaptureException(e);
    }
  };
