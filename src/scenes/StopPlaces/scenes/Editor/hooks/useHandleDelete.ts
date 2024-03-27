import { deleteFlexibleStopPlaceById } from 'actions/flexibleStopPlaces';
import { useAppDispatch } from 'app/hooks';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

export const useHandleDelete = (
  flexibleStopPlace: FlexibleStopPlace | undefined,
  onCall: () => void,
  onDeleteStart: () => void,
  onDeleteEnd: () => void
) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intl = useIntl();

  const handleDelete = useCallback(() => {
    onCall();
    if (flexibleStopPlace?.id) {
      onDeleteStart();
      dispatch(deleteFlexibleStopPlaceById(flexibleStopPlace.id, intl))
        .then(() => navigate('/stop-places'))
        .finally(() => onDeleteEnd());
    }
  }, [dispatch, history, flexibleStopPlace]);

  return handleDelete;
};
