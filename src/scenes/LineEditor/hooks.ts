import { ApolloError, ApolloQueryResult, useQuery } from '@apollo/client';
import { LINE_EDITOR_QUERY } from 'api/uttu/queries';
import { isBlank } from 'helpers/forms';
import useUttuError from 'hooks/useUttuError';
import Line, { initLine } from 'model/Line';
import { Network } from 'model/Network';
import { useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { useConfig } from '../../config/ConfigContext';

export const useUttuErrors = (
  error: ApolloError | undefined,
  deleteError: ApolloError | undefined,
  mutationError: ApolloError | undefined,
) => {
  const navigate = useNavigate();

  useUttuError(
    'loadLineByIdErrorHeader',
    'loadLineByIdErrorMessage',
    error,
    () => navigate('/lines'),
  );

  useUttuError('deleteLineErrorHeader', 'deleteLineErrorMessage', deleteError);
  useUttuError('saveLineErrorHeader', 'saveLineErrorMessage', mutationError);
};

type UseLineReturnType = {
  line: Line | undefined;
  setLine: React.Dispatch<React.SetStateAction<Line | undefined>>;
  refetchLine: (
    variables?: Partial<Record<string, any>> | undefined,
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
  const match = useMatch('/lines/edit/:id');
  const { sandboxFeatures } = useConfig();
  const [line, setLine] = useState<Line | undefined>(
    initLine(sandboxFeatures?.JourneyPatternStopPointMap),
  );

  const { loading, error, data, refetch } = useQuery<LineData>(
    LINE_EDITOR_QUERY,
    {
      variables: {
        id: match?.params.id || '',
        includeLine: !isBlank(match?.params.id),
      },
    },
  );

  useEffect(() => {
    if (data?.line) {
      setLine({
        ...data?.line,
        networkRef: data?.line.network?.id,
      });
    }
  }, [data?.line]);

  return {
    line,
    setLine,
    refetchLine: refetch,
    loading,
    error,
    networks: data?.networks,
    notFound: data?.line === null && !isBlank(match?.params.id),
  };
};
