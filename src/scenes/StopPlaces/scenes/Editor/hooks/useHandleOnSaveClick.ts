import { saveFlexibleStopPlace } from 'actions/flexibleStopPlaces';
import { useAppDispatch } from 'app/hooks';
import { objectValuesAreEmpty } from 'helpers/forms';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

export const useHandleOnSaveClick = (
  flexibleStopPlace: FlexibleStopPlace | undefined,
  onCall: () => void,
  onSaveStart: () => void,
  onSaveEnd: () => void,
  errors: any,
) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intl = useIntl();

  const handleOnSaveClick = useCallback(() => {
    onCall();
    if (objectValuesAreEmpty([errors])) {
      onSaveStart();
      dispatch(saveFlexibleStopPlace(flexibleStopPlace ?? {}, intl))
        .then(() => navigate('/stop-places'))
        .finally(() => onSaveEnd());
    }
  }, [dispatch, history, flexibleStopPlace, errors]);

  return handleOnSaveClick;
};
