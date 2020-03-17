import { UttuQuery } from 'graphql';
import {
  getFlexibleLineByIdQuery,
  getFlexibleLinesQuery
} from 'graphql/uttu/queries';
import { FlexibleLine } from 'model';
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

export const RECEIVE_FLEXIBLE_LINES = 'RECEIVE_FLEXIBLE_LINES';
export const RECEIVE_FLEXIBLE_LINE = 'RECEIVE_FLEXIBLE_LINE';

const receiveFlexibleLinesActionCreator = lines => ({
  type: RECEIVE_FLEXIBLE_LINES,
  lines
});

const receiveFlexibleLineActionCreator = line => ({
  type: RECEIVE_FLEXIBLE_LINE,
  line
});

export const loadFlexibleLines = () => async (dispatch, getState) => {
  try {
    const data = await UttuQuery(
      getState().providers.active,
      getFlexibleLinesQuery,
      {}
    );
    const flexibleLines = data.flexibleLines.map(fl => new FlexibleLine(fl));
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

export const loadFlexibleLineById = id => async (dispatch, getState) => {
  try {
    const data = await UttuQuery(
      getState().providers.active,
      getFlexibleLineByIdQuery,
      { id }
    );

    dispatch(
      receiveFlexibleLineActionCreator(new FlexibleLine(data.flexibleLine))
    );
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

export const saveFlexibleLine = flexibleLine => async (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());
  try {
    await UttuQuery(activeProvider, flexibleLineMutation, {
      input: flexibleLine.toPayload()
    });
    dispatch(
      showSuccessNotification(
        intl.formatMessage(messages.saveLineSuccessHeader),
        `${flexibleLine.name} ${intl.formatMessage(
          messages.saveLineSuccessMessage
        )}`,
        true
      )
    );
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

export const deleteFlexibleLineById = id => async (dispatch, getState) => {
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
