import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, NetworkStatus } from '@apollo/client';

import { Heading1 } from '@entur/typography';
import { SecondaryButton } from '@entur/button';
import { AddIcon } from '@entur/icons';

import { GlobalState } from 'reducers';
import { OrganisationState } from 'reducers/organisations';
import Line from 'model/Line';
import { GET_LINES } from 'api/uttu/queries';
import useRefetchOnLocationChange from 'hooks/useRefetchOnLocationChange';

import LinesTable from 'components/LinesTable';
import useUttuError from 'hooks/useUttuError';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useConfirmDeleteLine } from './hooks';

interface LinesData {
  lines: Line[];
}

export default () => {
  const { formatMessage } = useSelector(selectIntl);

  const [lineSelectedForDeletion, setLineSelectedForDeletion] = useState<
    Line | undefined
  >();

  const { loading, data, error, refetch, networkStatus } = useQuery<LinesData>(
    GET_LINES,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  const [confirmDeleteLine] = useConfirmDeleteLine(
    lineSelectedForDeletion?.id!,
    () => {
      setLineSelectedForDeletion(undefined);
      refetch();
    }
  );

  const dismissDeleteLine = useCallback(() => {
    setLineSelectedForDeletion(undefined);
  }, [setLineSelectedForDeletion]);

  useRefetchOnLocationChange(refetch);
  useUttuError('loadLinesErrorHeader', 'loadLinesErrorMessage', error);

  const organisations = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );

  const navigate = useNavigate();
  const handleOnRowClick = (line: Line) => navigate(`/lines/edit/${line.id}`);

  const done = !loading && networkStatus !== NetworkStatus.refetch;

  return (
    <div className="lines">
      <Heading1>{formatMessage('linesHeader')}</Heading1>

      <SecondaryButton as={Link} to="/lines/create" className="new-line-button">
        <AddIcon />
        {formatMessage('linesCreateLineIconButtonLabel')}
      </SecondaryButton>

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
