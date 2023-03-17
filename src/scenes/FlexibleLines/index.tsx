import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AddIcon } from '@entur/icons';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { Heading1 } from '@entur/typography';
import { deleteLine, loadFlexibleLines } from 'actions/flexibleLines';
import './styles.scss';
import { selectIntl } from 'i18n';
import { GlobalState } from 'reducers';
import { OrganisationState } from 'reducers/organisations';
import { FlexibleLinesState } from 'reducers/flexibleLines';
import ConfirmDialog from 'components/ConfirmDialog';
import FlexibleLine from 'model/FlexibleLine';
import LinesTable from 'components/LinesTable';

export default () => {
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedLine, setSelectedLine] = useState<FlexibleLine | undefined>(
    undefined
  );
  const { formatMessage } = useSelector(selectIntl);
  const lines = useSelector<GlobalState, FlexibleLinesState>(
    (state) => state.flexibleLines
  );
  const operator = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadFlexibleLines());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleOnRowClick = (line: FlexibleLine) =>
    navigate(`/flexible-lines/edit/${line.id}`);
  const handleOnRowDeleteClick = (line: FlexibleLine) => {
    setSelectedLine(line);
    setShowDeleteDialogue(true);
  };

  return (
    <div className="flexible-lines">
      <Heading1>{formatMessage('linesHeader')}</Heading1>

      <section className="buttons">
        <SecondaryButton
          as={Link}
          to="/flexible-lines/create"
          className="new-flexible-line-button"
        >
          <AddIcon />
          {formatMessage('linesCreateFlexibleLineIconButtonLabel')}
        </SecondaryButton>
      </section>

      <LinesTable
        lines={lines!}
        organisations={operator!}
        onRowClick={handleOnRowClick}
        onDeleteRowClick={handleOnRowDeleteClick}
      />

      {showDeleteDialogue && selectedLine && (
        <ConfirmDialog
          isOpen
          onDismiss={() => {
            setSelectedLine(undefined);
            setShowDeleteDialogue(false);
          }}
          title={formatMessage('editorDeleteLineConfirmationDialogTitle')}
          message={formatMessage('editorDeleteLineConfirmationDialogMessage')}
          buttons={[
            <SecondaryButton
              key="no"
              onClick={() => {
                setSelectedLine(undefined);
                setShowDeleteDialogue(false);
              }}
            >
              {formatMessage('no')}
            </SecondaryButton>,
            <SuccessButton
              key="yes"
              onClick={() => {
                dispatch(deleteLine(selectedLine))
                  .then(() => {
                    setSelectedLine(undefined);
                    setShowDeleteDialogue(false);
                  })
                  .then(() => dispatch(loadFlexibleLines()));
              }}
            >
              {formatMessage('yes')}
            </SuccessButton>,
          ]}
        />
      )}
    </div>
  );
};
