import useUttuError from 'hooks/useUttuError';
import { ApolloError } from '@apollo/client';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Line, { initLine } from 'model/Line';
import { isBlank } from 'helpers/forms';
import { MatchParams } from 'http/http';

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

type UseLineType = (
  lineData: Line | undefined
) => [Line | undefined, React.Dispatch<React.SetStateAction<Line | undefined>>];

export const useLine: UseLineType = (lineData) => {
  const [line, setLine] = useState<Line>();
  const match = useRouteMatch<MatchParams>();

  useEffect(() => {
    if (lineData) {
      setLine({
        ...lineData,
        networkRef: lineData.network?.id,
      });
    }
  }, [lineData]);

  useEffect(() => {
    if (isBlank(match?.params.id)) {
      setLine(initLine());
    }
  }, [match]);

  return [line, setLine];
};
