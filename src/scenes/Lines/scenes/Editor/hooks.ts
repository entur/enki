import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadFlexibleStopPlaces } from 'actions/flexibleStopPlaces';
import { loadNetworks } from 'actions/networks';
import { loadFlexibleLineById } from 'actions/flexibleLines';
import { equals } from 'ramda';

export const usePristine = (value: any, spoil: boolean): boolean => {
  const [isPristine, setIsPristine] = useState<boolean>(true);
  const [initValue] = useState<any>(value);

  useEffect(() => {
    if (!equals(initValue, value)) setIsPristine(false);
  }, [value, initValue]);

  return isPristine && !spoil;
};

export const useLoadDependencies = ({
  match,
  history,
}: RouteComponentProps<MatchParams>) => {
  const [networksIsLoading, setNetworksIsLoading] = useState(true);
  const [flexibleLineIsLoading, setFlexibleLineIsLoading] = useState(true);
  const [
    flexibleStopPlacesIsLoading,
    setFlexibleStopPlacesIsLoading,
  ] = useState(true);

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
    if (match.params.id) {
      dispatch(loadFlexibleLineById(match.params.id))
        .catch(() => history.push('/lines'))
        .then(() => setFlexibleLineIsLoading(false));
    } else {
      setFlexibleLineIsLoading(false);
    }
  }, [dispatch, match.params.id, history]);

  useEffect(() => {
    dispatchLoadNetworks();
    dispatchLoadFlexibleLineById();
    dispatchLoadFlexibleStopPlaces();
  }, [
    dispatchLoadNetworks,
    dispatchLoadFlexibleStopPlaces,
    dispatchLoadFlexibleLineById,
  ]);
  return (
    networksIsLoading || flexibleLineIsLoading || flexibleStopPlacesIsLoading
  );
};
