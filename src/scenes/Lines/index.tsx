import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import Add from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

import { GET_LINES } from 'api/uttu/queries';
import LinesTable from 'components/LinesTable';
import Loading from 'components/Loading';
import useRefetchOnLocationChange from 'hooks/useRefetchOnLocationChange';
import Line from 'model/Line';
import useUttuError from 'hooks/useUttuError';
import { useAppSelector } from '../../store/hooks';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useConfirmDeleteLine } from './hooks';

interface LinesData {
  lines: Line[];
}

export default () => {
  const { formatMessage } = useIntl();

  const [lineSelectedForDeletion, setLineSelectedForDeletion] = useState<
    Line | undefined
  >();

  const { loading, data, error, refetch, networkStatus } = useQuery<LinesData>(
    GET_LINES,
    {
      notifyOnNetworkStatusChange: true,
    },
  );

  const [confirmDeleteLine] = useConfirmDeleteLine(
    lineSelectedForDeletion?.id!,
    () => {
      setLineSelectedForDeletion(undefined);
      refetch();
    },
  );

  const dismissDeleteLine = useCallback(() => {
    setLineSelectedForDeletion(undefined);
  }, [setLineSelectedForDeletion]);

  useRefetchOnLocationChange(refetch);
  useUttuError('loadLinesErrorHeader', 'loadLinesErrorMessage', error);

  const organisations = useAppSelector((state) => state.organisations);

  const navigate = useNavigate();
  const handleOnRowClick = (line: Line) => navigate(`/lines/edit/${line.id}`);

  const done = !loading && networkStatus !== NetworkStatus.refetch;

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <Typography variant="h1">
        {formatMessage({ id: 'linesHeader' })}
      </Typography>

      <Button
        variant="outlined"
        component={Link}
        to="/lines/create"
        startIcon={<Add />}
        sx={{ alignSelf: 'flex-start' }}
      >
        {formatMessage({ id: 'linesCreateLineIconButtonLabel' })}
      </Button>

      <Loading
        isLoading={!done}
        text={formatMessage({ id: 'linesLoadingText' })}
      >
        <LinesTable
          lines={data?.lines ?? []}
          organisations={organisations!}
          onRowClick={handleOnRowClick}
          onDeleteRowClick={setLineSelectedForDeletion}
        />
      </Loading>

      <DeleteConfirmationDialog
        visible={!!lineSelectedForDeletion}
        onDismiss={dismissDeleteLine}
        onConfirm={confirmDeleteLine}
      />
    </Stack>
  );
};
