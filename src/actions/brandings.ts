import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import { UttuQuery } from 'api';
import { deleteBranding, brandingMutation } from 'api/uttu/mutations';
import { getBrandingByIdQuery, getBrandingsQuery } from 'api/uttu/queries';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { Branding } from 'model/Branding';
import { IntlShape } from 'react-intl';
import { AppThunk } from 'store/store';
import { receiveBrandings, receiveBranding } from '../reducers/brandingsSlice';

// Re-export actions from slice
export { receiveBrandings, receiveBranding };

export const loadBrandings =
  (intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    try {
      const data = await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        getBrandingsQuery,
        {},
        await getState().auth.getAccessToken(),
      );
      dispatch(receiveBrandings(data.brandings));
      return data.brandings;
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'brandingsLoadBrandingsErrorHeader' }),
          intl.formatMessage(
            { id: 'brandingsLoadBrandingsErrorMessage' },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };

export const loadBrandingById =
  (id: string, intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    try {
      const data = await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        getBrandingByIdQuery,
        { id },
        await getState().auth.getAccessToken(),
      );
      dispatch(receiveBranding(data.branding));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'brandingsLoadBrandingByIdErrorHeader' }),
          intl.formatMessage(
            { id: 'brandingsLoadBrandingByIdErrorMessage' },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };

export const saveBranding =
  (branding: Branding, intl: IntlShape, showConfirm = true): AppThunk =>
  async (dispatch, getState) => {
    try {
      await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        brandingMutation,
        {
          input: branding,
        },
        await getState().auth.getAccessToken(),
      );
      if (showConfirm) {
        dispatch(
          showSuccessNotification(
            intl.formatMessage({ id: 'brandingsSaveBrandingSuccessHeader' }),
            intl.formatMessage({ id: 'brandingsSaveBrandingSuccessMessage' }),
          ),
        );
      }
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'brandingsSaveBrandingErrorHeader' }),
          intl.formatMessage(
            { id: 'brandingsSaveBrandingErrorMessage' },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };

export const deleteBrandingById =
  (id: string | undefined, intl: IntlShape): AppThunk =>
  async (dispatch, getState) => {
    if (!id) return;

    try {
      await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        deleteBranding,
        {
          id,
        },
        await getState().auth.getAccessToken(),
      );
      dispatch(
        showSuccessNotification(
          intl.formatMessage({ id: 'brandingsDeleteBrandingSuccessHeader' }),
          intl.formatMessage({ id: 'brandingsDeleteBrandingSuccessMessage' }),
        ),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: 'brandingsDeleteBrandingErrorHeader' }),
          intl.formatMessage(
            { id: 'brandingsDeleteBrandingErrorMessage' },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };
