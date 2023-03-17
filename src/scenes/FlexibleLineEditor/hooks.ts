import { useNavigate, useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadFlexibleStopPlaces } from 'actions/flexibleStopPlaces';
import { loadNetworks } from 'actions/networks';
import { loadFlexibleLineById } from 'actions/flexibleLines';

export const useLoadDependencies = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [networksIsLoading, setNetworksIsLoading] = useState(true);
  const [flexibleLineIsLoading, setFlexibleLineIsLoading] = useState(true);
  const [flexibleStopPlacesIsLoading, setFlexibleStopPlacesIsLoading] =
    useState(true);

  const dispatch = useDispatch<any>();

  const dispatchLoadFlexibleStopPlaces = useCallback(
    () =>
      dispatch(loadFlexibleStopPlaces()).then(() =>
        setFlexibleStopPlacesIsLoading(false)
      ),
    [dispatch]
  );

  const dispatchLoadNetworks = useCallback(
    () => dispatch(loadNetworks()).then(() => setNetworksIsLoading(false)),
    [dispatch]
  );

  const dispatchLoadFlexibleLineById = useCallback(() => {
    if (params.id) {
      const lineType = params.id.split(':')[1];
      const isFlexibleLine = lineType === 'FlexibleLine';
      dispatch(loadFlexibleLineById(params.id, isFlexibleLine))
        .catch(() => navigate(isFlexibleLine ? '/flexible-lines' : '/lines'))
        .then(() => setFlexibleLineIsLoading(false));
    } else {
      setFlexibleLineIsLoading(false);
    }
  }, [dispatch, params.id, navigate]);

  useEffect(() => {
    dispatchLoadNetworks();
    dispatchLoadFlexibleLineById();
    dispatchLoadFlexibleStopPlaces();
  }, [
    dispatchLoadNetworks,
    dispatchLoadFlexibleStopPlaces,
    dispatchLoadFlexibleLineById,
  ]);
  return {
    isLoadingDependencies:
      networksIsLoading || flexibleLineIsLoading || flexibleStopPlacesIsLoading,
    refetchFlexibleLine: dispatchLoadFlexibleLineById,
  };
};
