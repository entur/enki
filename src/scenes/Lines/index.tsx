import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Link, useHistory } from 'react-router-dom';
import { useQuery, useMutation, NetworkStatus } from '@apollo/client';

import { Heading1 } from '@entur/typography';
import { SecondaryButton } from '@entur/button';
import { AddIcon } from '@entur/icons';

import { GlobalState } from 'reducers';
import { OrganisationState } from 'reducers/organisations';
import Line from 'model/Line';
import { GET_LINES } from 'api/uttu/queries';
import { DELETE_LINE } from 'api/uttu/mutations';
import useRefetchOnLocationChange from 'hooks/useRefetchOnLocationChange';

import LinesTable from 'components/LinesTable';
import useUttuError from 'hooks/useUttuError';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

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
  const [deleteLine] = useMutation(DELETE_LINE);

  const confirmDelete = useCallback(async () => {
    await deleteLine({
      variables: {
        id: lineSelectedForDeletion?.id,
      },
    });
    setLineSelectedForDeletion(undefined);
    refetch();
  }, [
    deleteLine,
    lineSelectedForDeletion,
    setLineSelectedForDeletion,
    refetch,
  ]);

  const dismissDelete = useCallback(() => {
    setLineSelectedForDeletion(undefined);
  }, [setLineSelectedForDeletion]);

  useRefetchOnLocationChange(refetch);
  useUttuError('loadLinesErrorHeader', 'loadLinesErrorMessage', error);

  const organisations = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );

  const history = useHistory();
  const handleOnRowClick = (line: Line) =>
    history.push(`/lines/edit/${line.id}`);

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
        onDismiss={dismissDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
