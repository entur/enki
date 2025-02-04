import { loadFlexibleLineById } from 'actions/flexibleLines';
import { loadFlexibleStopPlaces } from 'actions/flexibleStopPlaces';
import { loadNetworks } from 'actions/networks';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { loadBrandings } from '../../actions/brandings';

export const useLoadDependencies = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [networksIsLoading, setNetworksIsLoading] = useState(true);
  const [brandingsIsLoading, setBrandingsIsLoading] = useState(true);
  const [flexibleLineIsLoading, setFlexibleLineIsLoading] = useState(true);
  const [flexibleStopPlacesIsLoading, setFlexibleStopPlacesIsLoading] =
    useState(true);

  const dispatch = useDispatch<any>();
  const intl = useIntl();

  const dispatchLoadFlexibleStopPlaces = useCallback(
    () =>
      dispatch(loadFlexibleStopPlaces(intl)).then(() =>
        setFlexibleStopPlacesIsLoading(false),
      ),
    [dispatch],
  );

  const dispatchLoadNetworks = useCallback(
    () => dispatch(loadNetworks()).then(() => setNetworksIsLoading(false)),
    [dispatch],
  );

  const dispatchLoadBrandings = useCallback(
    () => dispatch(loadBrandings()).then(() => setBrandingsIsLoading(false)),
    [dispatch],
  );

  const dispatchLoadFlexibleLineById = useCallback(() => {
    if (params.id) {
      const lineType = params.id.split(':')[1];
      const isFlexibleLine = lineType === 'FlexibleLine';
      dispatch(loadFlexibleLineById(params.id, isFlexibleLine, intl))
        .catch(() => navigate(isFlexibleLine ? '/flexible-lines' : '/lines'))
        .then(() => setFlexibleLineIsLoading(false));
    } else {
      setFlexibleLineIsLoading(false);
    }
  }, [dispatch, params.id, navigate]);

  useEffect(() => {
    dispatchLoadNetworks();
    dispatchLoadBrandings();
    dispatchLoadFlexibleLineById();
    dispatchLoadFlexibleStopPlaces();
  }, [
    dispatchLoadNetworks,
    dispatchLoadBrandings,
    dispatchLoadFlexibleStopPlaces,
    dispatchLoadFlexibleLineById,
  ]);
  return {
    isLoadingDependencies:
      networksIsLoading ||
      brandingsIsLoading ||
      flexibleLineIsLoading ||
      flexibleStopPlacesIsLoading,
    refetchFlexibleLine: dispatchLoadFlexibleLineById,
  };
};
