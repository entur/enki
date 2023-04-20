import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AddIcon } from '@entur/icons';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { Heading1 } from '@entur/typography';
import { deleteLine, loadFlexibleLines } from 'actions/flexibleLines';
import './styles.scss';
import { useIntl } from 'react-intl';
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
  const intl = useIntl();
  const { formatMessage } = intl;
  const lines = useSelector<GlobalState, FlexibleLinesState>(
    (state) => state.flexibleLines
  );
  const operator = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadFlexibleLines(intl));
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
      <Heading1>{formatMessage({ id: 'linesHeader' })}</Heading1>

      <section className="buttons">
        <SecondaryButton
          as={Link}
          to="/flexible-lines/create"
          className="new-flexible-line-button"
        >
          <AddIcon />
          {formatMessage({ id: 'linesCreateFlexibleLineIconButtonLabel' })}
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
          title={formatMessage({
            id: 'editorDeleteLineConfirmationDialogTitle',
          })}
          message={formatMessage({
            id: 'editorDeleteLineConfirmationDialogMessage',
          })}
          buttons={[
            <SecondaryButton
              key="no"
              onClick={() => {
                setSelectedLine(undefined);
                setShowDeleteDialogue(false);
              }}
            >
              {formatMessage({ id: 'no' })}
            </SecondaryButton>,
            <SuccessButton
              key="yes"
              onClick={() => {
                dispatch(deleteLine(selectedLine, intl))
                  .then(() => {
                    setSelectedLine(undefined);
                    setShowDeleteDialogue(false);
                  })
                  .then(() => dispatch(loadFlexibleLines(intl)));
              }}
            >
              {formatMessage({ id: 'yes' })}
            </SuccessButton>,
          ]}
        />
      )}
    </div>
  );
};
