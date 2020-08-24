import useUttuError from 'hooks/useUttuError';
import { ApolloError, useQuery, ApolloQueryResult } from '@apollo/client';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Line, { initLine } from 'model/Line';
import { isBlank } from 'helpers/forms';
import { MatchParams } from 'http/http';
import { filterAuthorities } from 'reducers/organisations';
import Provider from 'model/Provider';
import { Network } from 'model/Network';
import { useDispatch, useSelector } from 'react-redux';
import { LINE_EDITOR_QUERY } from 'api/uttu/queries';
import { GlobalState } from 'reducers';
import { saveNetwork } from 'actions/networks';

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
  loading: boolean;
  error: ApolloError | undefined;
  networks: Network[] | undefined;
};

type UseLineType = () => UseLineReturnType;

const findNetworkIdByProvider = (
  provider: Provider,
  networks: Network[]
): string | undefined =>
  networks.find(
    (network) =>
      network.id?.split(':')?.[0]?.toUpperCase() === provider.codespace?.xmlns
  )?.id;

// TODO: refactor with apollo hooks
const createAndGetNetwork = (
  dispatch: any,
  authorityRef: string,
  activeProvider: Provider,
  refetch: (
    variables?: Partial<Record<string, any>> | undefined
  ) => Promise<ApolloQueryResult<LineData>>
): Promise<string> =>
  dispatch(
    saveNetwork(
      {
        name: activeProvider.codespace?.xmlns ?? 'New network',
        authorityRef: authorityRef,
      },
      false
    )
  )
    .then(() => refetch())
    .then((newNetworks: Network[]) =>
      findNetworkIdByProvider(activeProvider, newNetworks)
    );

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

  useEffect(() => {
    if (!data?.networks) {
      return;
    }
    if (isBlank(match?.params.id)) {
      const newLine = initLine();
      const authorities = filterAuthorities(organisations!, activeProvider);
      if (data?.networks?.length > 1 || authorities.length === 0) {
        setLine(newLine);
      } else {
        const networkRef = findNetworkIdByProvider(
          activeProvider!,
          data?.networks
        );
        if (networkRef) {
          setLine({ ...newLine, networkRef });
        } else {
          createAndGetNetwork(
            dispatch,
            authorities[0].id,
            activeProvider!,
            refetch
          ).then((ref) => setLine({ ...newLine, networkRef: ref }));
        }
      }
    }
  }, [match, data, activeProvider, dispatch, organisations, refetch]);

  return {
    line,
    setLine,
    loading,
    error,
    networks: data?.networks,
  };
};
