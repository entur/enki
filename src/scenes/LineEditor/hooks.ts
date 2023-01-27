import useUttuError from 'hooks/useUttuError';
import { ApolloError, useQuery, ApolloQueryResult } from '@apollo/client';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Line, { initLine } from 'model/Line';
import { isBlank } from 'helpers/forms';
import { MatchParams } from 'http/http';
import { Network } from 'model/Network';
import { useDispatch, useSelector } from 'react-redux';
import { LINE_EDITOR_QUERY } from 'api/uttu/queries';
import { GlobalState } from 'reducers';
import { useConfig } from 'config/ConfigContext';

export const useUttuErrors = (
  error: ApolloError | undefined,
  deleteError: ApolloError | undefined,
  mutationError: ApolloError | undefined
) => {
  const history = useHistory();
  useUttuError(
    'loadLineByIdErrorHeader',
    'loadLineByIdErrorMessage',
    error,
    () => history.push('/lines')
  );

  useUttuError('deleteLineErrorHeader', 'deleteLineErrorMessage', deleteError);
  useUttuError('saveLineErrorHeader', 'saveLineErrorMessage', mutationError);
};

type UseLineReturnType = {
  line: Line | undefined;
  setLine: React.Dispatch<React.SetStateAction<Line | undefined>>;
  refetchLine: (
    variables?: Partial<Record<string, any>> | undefined
  ) => Promise<ApolloQueryResult<LineData>>;
  loading: boolean;
  error: ApolloError | undefined;
  networks: Network[] | undefined;
};

type UseLineType = () => UseLineReturnType;

interface LineData {
  line: Line;
  networks: Network[] | undefined;
}

export const useLine: UseLineType = () => {
  const [line, setLine] = useState<Line>();
  const match = useRouteMatch<MatchParams>('/lines/edit/:id');
  const dispatch = useDispatch<any>();

  const {
    organisations,
    providers: { active: activeProvider },
  } = useSelector<GlobalState, GlobalState>((s) => s);

  const { loading, error, data, refetch } = useQuery<LineData>(
    LINE_EDITOR_QUERY,
    {
      variables: {
        id: match?.params.id || '',
        includeLine: !isBlank(match?.params.id),
      },
    }
  );

  useEffect(() => {
    if (data?.line) {
      setLine({
        ...data.line,
        networkRef: data.line.network?.id,
      });
    }
  }, [data]);

  const config = useConfig();

  useEffect(() => {
    if (isBlank(match?.params.id)) {
      setLine(initLine());
    }
  }, [
    match,
    data,
    activeProvider,
    dispatch,
    organisations,
    refetch,
    config.enableLegacyOrganisationsFilter,
  ]);

  return {
    line,
    setLine,
    refetchLine: refetch,
    loading,
    error,
    networks: data?.networks,
  };
};
