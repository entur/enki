import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import { UttuQuery } from 'api';
import { DELETE_DAY_TYPE, MUTATE_DAY_TYPE } from 'api/uttu/mutations';
import { GET_DAY_TYPES, GET_DAY_TYPES_BY_IDS } from 'api/uttu/queries';
import { AppThunk } from 'store/store';
import { UttuError, getInternationalizedUttuError } from 'helpers/uttu';
import DayType, { dayTypeToPayload } from 'model/DayType';
import { receiveDayTypes, receiveDayType } from '../reducers/dayTypesSlice';
import { IntlShape } from 'react-intl';
import { print } from 'graphql';

// Re-export actions from slice
export { receiveDayTypes, receiveDayType };

export const loadDayTypes =
  (intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    try {
      const data = await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        print(GET_DAY_TYPES),
        {},
        await getState().auth.getAccessToken(),
      );
      dispatch(receiveDayTypes(data.dayTypes));
      return data.dayTypes;
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'dayTypesLoadDayTypesErrorTitle' }),
          getInternationalizedUttuError(intl, e as UttuError),
        ),
      );
    }
  };

export const loadDayTypeById =
  (id: string, intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    try {
      const data = await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        print(GET_DAY_TYPES_BY_IDS),
        { ids: [id] },
        await getState().auth.getAccessToken(),
      );
      if (data.dayTypesByIds?.length > 0) {
        dispatch(receiveDayType(data.dayTypesByIds[0]));
      }
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'dayTypesLoadDayTypeErrorTitle' }),
          getInternationalizedUttuError(intl, e as UttuError),
        ),
      );
    }
  };

export const saveDayType =
  (dayType: DayType, intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    try {
      await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        print(MUTATE_DAY_TYPE),
        {
          input: dayTypeToPayload(dayType),
        },
        await getState().auth.getAccessToken(),
      );
      dispatch(
        showSuccessNotification(
          intl.formatMessage({ id: 'dayTypesSaveDayTypeSuccessTitle' }),
          intl.formatMessage({ id: 'dayTypesSaveDayTypeSuccessMessage' }),
        ),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'dayTypesSaveDayTypeErrorTitle' }),
          getInternationalizedUttuError(intl, e as UttuError),
        ),
      );
    }
  };

export const deleteDayTypeById =
  (id: string | undefined, intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    if (!id) return;

    try {
      await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        DELETE_DAY_TYPE,
        { id },
        await getState().auth.getAccessToken(),
      );
      dispatch(
        showSuccessNotification(
          intl.formatMessage({ id: 'dayTypesDeleteDayTypeSuccessTitle' }),
          intl.formatMessage({ id: 'dayTypesDeleteDayTypeSuccessMessage' }),
        ),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'dayTypesDeleteDayTypeErrorTitle' }),
          getInternationalizedUttuError(intl, e as UttuError),
        ),
      );
    }
  };
