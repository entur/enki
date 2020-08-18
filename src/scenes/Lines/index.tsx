import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Link, useHistory } from 'react-router-dom';

import { Heading1 } from '@entur/typography';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { AddIcon } from '@entur/icons';

import { GlobalState } from 'reducers';
import { loadLines, deleteLine } from 'actions/lines';
import { OrganisationState } from 'reducers/organisations';
import Line from 'model/Line';

import LinesTable from 'components/LinesTable';
import ConfirmDialog from 'components/ConfirmDialog';

import { useQuery, useMutation, gql } from '@apollo/client';

const GET_LINES = gql`
  query GetLines {
    lines {
      id
      name
      privateCode
      operatorRef
    }
  }
`;

const DELETE_LINE = gql`
  mutation Deleteline($id: ID!) {
    deleteLine(id: $id) {
      id
    }
  }
`;

interface LinesData {
  lines: Line[];
}

export default () => {
  const { formatMessage } = useSelector(selectIntl);

  const [lineSelectedForDeletion, setLineSelectedForDeletion] = useState<
    Line | undefined
  >();

  const { loading, error, data, refetch } = useQuery<LinesData>(GET_LINES);
  const [deleteLine] = useMutation(DELETE_LINE);

  const organisations = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );

  const dispatch = useDispatch<any>();

  const history = useHistory();

  const handleOnRowClick = (line: Line) =>
    history.push(`/lines/edit/${line.id}`);

  return (
    <div className="lines">
      <Heading1>{formatMessage('linesHeader')}</Heading1>

      <section className="buttons">
        <SecondaryButton
          as={Link}
          to="/lines/create"
          className="new-line-button"
        >
          <AddIcon />
          {formatMessage('linesCreateLineIconButtonLabel')}
        </SecondaryButton>
      </section>

      <LinesTable
        lines={data && data.lines}
        organisations={organisations!}
        onRowClick={handleOnRowClick}
        onDeleteRowClick={setLineSelectedForDeletion}
      />

      {lineSelectedForDeletion && (
        <ConfirmDialog
          isOpen
          onDismiss={() => {
            setLineSelectedForDeletion(undefined);
          }}
          title={formatMessage('editorDeleteLineConfirmationDialogTitle')}
          message={formatMessage('editorDeleteLineConfirmationDialogMessage')}
          buttons={[
            <SecondaryButton
              key="no"
              onClick={() => {
                setLineSelectedForDeletion(undefined);
              }}
            >
              {formatMessage('tableNo')}
            </SecondaryButton>,
            <SuccessButton
              key="yes"
              onClick={async () => {
                await deleteLine({
                  variables: {
                    id: lineSelectedForDeletion.id,
                  },
                });
                setLineSelectedForDeletion(undefined);
                refetch();
              }}
            >
              {formatMessage('tableYes')}
            </SuccessButton>,
          ]}
        />
      )}
    </div>
  );
};
