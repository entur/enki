import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import { UttuQuery } from 'api';
import { deleteBranding, brandingMutation } from 'api/uttu/mutations';
import { getBrandingByIdQuery, getBrandingsQuery } from 'api/uttu/queries';
import { AppThunk, sentryCaptureException } from 'store/store';
import { UttuError, getStyledUttuError } from 'helpers/uttu';
import { Branding } from 'model/Branding';
import { RECEIVE_BRANDING, RECEIVE_BRANDINGS } from './constants';

const receiveBrandingsActionCreator = (brandings: Branding[]) => ({
  type: RECEIVE_BRANDINGS,
  brandings,
});

const receiveBrandingActionCreator = (branding: Branding) => ({
  type: RECEIVE_BRANDING,
  branding,
});

export const loadBrandings = (): AppThunk => async (dispatch, getState) => {
  try {
    const data = await UttuQuery(
      getState().config.uttuApiUrl,
      getState().userContext.activeProviderCode ?? '',
      getBrandingsQuery,
      {},
      await getState().auth.getAccessToken(),
    );
    dispatch(receiveBrandingsActionCreator(data.brandings));
    return data.brandings;
  } catch (e) {
    dispatch(
      showErrorNotification(
        'Laste merkevarer',
        getStyledUttuError(
          e as UttuError,
          'En feil oppstod under lastingen av merkevarene',
          'Prøv igjen senere.',
        ),
      ),
    );
    sentryCaptureException(e);
  }
};

export const loadBrandingById =
  (id: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const data = await UttuQuery(
        getState().config.uttuApiUrl,
        getState().userContext.activeProviderCode ?? '',
        getBrandingByIdQuery,
        { id },
        await getState().auth.getAccessToken(),
      );
      dispatch(receiveBrandingActionCreator(data.branding));
    } catch (e) {
      dispatch(
        showErrorNotification(
          'Laste merkevare',
          getStyledUttuError(
            e as UttuError,
            'En feil oppstod under lastingen av merkevaret',
            'Prøv igjen senere.',
          ),
        ),
      );
      sentryCaptureException(e);
    }
  };

export const saveBranding =
  (branding: Branding, showConfirm = true): AppThunk =>
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
          showSuccessNotification('Lagre merkevare', 'Merkevaret ble lagret.'),
        );
      }
    } catch (e) {
      dispatch(
        showErrorNotification(
          'Lagre merkevare',
          getStyledUttuError(
            e as UttuError,
            'En feil oppstod under lagringen av merkevaret',
            'Prøv igjen senere.',
          ),
        ),
      );
      sentryCaptureException(e);
    }
  };

export const deleteBrandingById =
  (id: string | undefined): AppThunk =>
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
        showSuccessNotification('Slette merkevare', 'Merkevaret ble slettet.'),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          'Slette merkevare',
          getStyledUttuError(
            e as UttuError,
            'En feil oppstod under slettingen av merkevaret',
          ),
        ),
      );
      sentryCaptureException(e);
    }
  };
