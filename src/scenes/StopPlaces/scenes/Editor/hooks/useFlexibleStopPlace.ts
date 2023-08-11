import { loadFlexibleLines } from 'actions/flexibleLines';
import { loadFlexibleStopPlaceById } from 'actions/flexibleStopPlaces';
import isEqual from 'lodash.isequal';
import FlexibleLine from 'model/FlexibleLine';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { VEHICLE_MODE } from 'model/enums';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalState } from 'reducers';

export const useFlexibleStopPlace = () => {
  const params = useParams();
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const lines = useSelector<GlobalState, FlexibleLine[]>(
    (state) => state.flexibleLines ?? []
  );

  const currentFlexibleStopPlace = useSelector<GlobalState, FlexibleStopPlace>(
    (state) =>
      state.flexibleStopPlaces?.find((fsp) => fsp.id === params.id) ?? {
        transportMode: VEHICLE_MODE.BUS,
        flexibleAreas: [{}],
      }
  );

  const [flexibleStopPlace, setFlexibleStopPlace] = useState<
    FlexibleStopPlace | undefined
  >(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoading && !isEqual(currentFlexibleStopPlace, flexibleStopPlace))
      setFlexibleStopPlace(currentFlexibleStopPlace);
    // eslint-disable-next-line
  }, [isLoading]);

  useEffect(() => {
    if (params.id) {
      setIsLoading(true);
      dispatch(loadFlexibleLines(intl))
        .then(() => dispatch(loadFlexibleStopPlaceById(params.id!, intl)))
        .catch(() => navigate('/networks'))
        .then(() => {
          setIsLoading(false);
        });
    } else {
      dispatch(loadFlexibleLines(intl)).then(() => setIsLoading(false));
    }
  }, [dispatch, params.id, history]);

  return { flexibleStopPlace, setFlexibleStopPlace, lines, isLoading };
};
