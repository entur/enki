import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Link, useHistory } from 'react-router-dom';

import { Heading1 } from '@entur/typography';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { AddIcon } from '@entur/icons';

import { GlobalState } from 'reducers';
import { LinesState } from 'reducers/lines';
import { loadLines, deleteLine } from 'actions/lines';
import { OrganisationState } from 'reducers/organisations';
import Line from 'model/Line';

import LinesTable from 'components/LinesTable';
import ConfirmDialog from 'components/ConfirmDialog';

export default () => {
  const { formatMessage } = useSelector(selectIntl);

  const [lineSelectedForDeletion, setLineSelectedForDeletion] = useState<
    Line | undefined
  >();

  const lines = useSelector<GlobalState, LinesState>((state) => state.lines);

  const organisations = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );

  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadLines());
  }, [dispatch]);

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
        lines={lines!}
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
              onClick={() => {
                dispatch(deleteLine(lineSelectedForDeletion))
                  .then(() => {
                    setLineSelectedForDeletion(undefined);
                  })
                  .then(() => dispatch(loadLines()));
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
