import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadFlexibleStopPlaces } from 'actions/flexibleStopPlaces';
import { loadNetworks } from 'actions/networks';
import { loadFlexibleLineById } from 'actions/flexibleLines';
import { FlexibleLinesState } from 'reducers/flexibleLines';
import { VEHICLE_MODE, VEHICLE_SUBMODE } from 'model/enums';
import FlexibleLine from 'model/FlexibleLine';
import { GlobalState } from 'reducers';
import { setSavedChanges } from 'actions/editor';

export const useLoadDependencies = ({
  match,
  history
}: RouteComponentProps<MatchParams>) => {
  const [networksIsLoading, setNetworksIsLoading] = useState(true);
  const [flexibleLineIsLoading, setFlexibleLineIsLoading] = useState(true);
  const [
    flexibleStopPlacesIsLoading,
    setFlexibleStopPlacesIsLoading
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
    dispatchLoadFlexibleLineById
  ]);
  return (
    networksIsLoading || flexibleLineIsLoading || flexibleStopPlacesIsLoading
  );
};

export const getFlexibleLineFromPath = (
  flexibleLines: FlexibleLinesState,
  match: { params: MatchParams }
) =>
  flexibleLines?.find(flexibleLine => flexibleLine.id === match.params.id) ?? {
    transportMode: VEHICLE_MODE.BUS,
    transportSubmode: VEHICLE_SUBMODE.LOCAL_BUS
  };

export const useFlexibleLine = (
  match: { params: MatchParams },
  loadDependencies: boolean
) => {
  const [flexibleLine, setFlexibleLine] = useState<FlexibleLine>({
    transportMode: VEHICLE_MODE.BUS,
    transportSubmode: VEHICLE_SUBMODE.LOCAL_BUS
  });

  const {
    flexibleLines,
    editor: { isSaved }
  } = useSelector<
    GlobalState,
    { flexibleLines: FlexibleLinesState; editor: { isSaved: boolean } }
  >(state => ({ flexibleLines: state.flexibleLines, editor: state.editor }));
  const dispatch = useDispatch();

  useEffect(() => {
    setFlexibleLine(getFlexibleLineFromPath(flexibleLines, match));
  }, [loadDependencies, flexibleLines, match]);

  const onFieldChange = useCallback(
    (flexibleLine: FlexibleLine) => {
      setFlexibleLine(flexibleLine);
      if (isSaved) {
        dispatch(setSavedChanges(false));
      }
    },
    [flexibleLine, dispatch, isSaved]
  );

  return {
    onFieldChange,
    flexibleLine
  };
};
