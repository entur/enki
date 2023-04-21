import { ApolloError, ApolloQueryResult, useQuery } from '@apollo/client';
import { LINE_EDITOR_QUERY } from 'api/uttu/queries';
import { useConfig } from 'config/ConfigContext';
import { isBlank } from 'helpers/forms';
import useUttuError from 'hooks/useUttuError';
import Line, { initLine } from 'model/Line';
import { Network } from 'model/Network';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch, useNavigate } from 'react-router-dom';
import { GlobalState } from 'reducers';

export const useUttuErrors = (
  error: ApolloError | undefined,
  deleteError: ApolloError | undefined,
  mutationError: ApolloError | undefined
) => {
  const navigate = useNavigate();

  useUttuError(
    'loadLineByIdErrorHeader',
    'loadLineByIdErrorMessage',
    error,
    () => navigate('/lines')
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
  notFound: boolean;
};

type UseLineType = () => UseLineReturnType;

interface LineData {
  line: Line;
  networks: Network[] | undefined;
}

export const useLine: UseLineType = () => {
  const [notFound, setNotFound] = useState(false);
  const [line, setLine] = useState<Line>();
  const match = useMatch('/lines/edit/:id');
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
    if (data?.line && !line) {
      setLine({
        ...data.line,
        networkRef: data.line.network?.id,
      });
    } else if (data?.line === null && !isBlank(match?.params.id) && !notFound) {
      setNotFound(true);
    }
  }, [data, match, notFound, line]);

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
    notFound,
  };
};
