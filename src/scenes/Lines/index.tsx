import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import Add from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';

import { GET_LINES } from 'api/uttu/queries';
import useRefetchOnLocationChange from 'hooks/useRefetchOnLocationChange';
import Line from 'model/Line';

import LinesTable from 'components/LinesTable';
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
    <div className="lines">
      <Typography variant="h1">
        {formatMessage({ id: 'linesHeader' })}
      </Typography>

      <Button
        variant="outlined"
        component={Link}
        to="/lines/create"
        className="new-line-button"
      >
        <Add />
        {formatMessage({ id: 'linesCreateLineIconButtonLabel' })}
      </Button>

      <LinesTable
        lines={done ? data && data.lines : undefined}
        organisations={organisations!}
        onRowClick={handleOnRowClick}
        onDeleteRowClick={setLineSelectedForDeletion}
      />

      <DeleteConfirmationDialog
        visible={!!lineSelectedForDeletion}
        onDismiss={dismissDeleteLine}
        onConfirm={confirmDeleteLine}
      />
    </div>
  );
};
