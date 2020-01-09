import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@entur/component-library';
import { DeleteIcon } from '@entur/icons';

import {
  Table,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from 'components/Table';
import { JourneyPattern } from 'model';
import ConfirmDialog from 'components/ConfirmDialog';

import './styles.css';
import { selectIntl } from 'i18n';
import messages from './messages';

const JourneyPatternsTable = ({
  journeyPatterns,
  onRowClick,
  onDeleteClick
}) => {
  const { formatMessage } = useSelector(selectIntl);
  const [removeDialogOpenFor, setRemoveDialogOpenFor] = useState(null);

  const showDeleteDialogFor = journeyPattern => {
    setRemoveDialogOpenFor(journeyPattern);
  };

  const doDelete = () => {
    onDeleteClick(removeDialogOpenFor);
    showDeleteDialogFor(null);
  };

  const tableRows =
    journeyPatterns.length > 0 ? (
      journeyPatterns.map((jp, i) => (
        <TableRow key={i} title={jp.description} onClick={() => onRowClick(i)}>
          <TableRowCell>
            {jp.name
              ? jp.name
              : formatMessage(messages.newJourneyPatternDefaultText)}
          </TableRowCell>
          <TableRowCell>{jp.directionType || ''}</TableRowCell>
          <TableRowCell>{jp.pointsInSequence.length}</TableRowCell>
          <TableRowCell>{jp.serviceJourneys.length}</TableRowCell>
          <TableRowCell>
            <div
              onClick={e => {
                showDeleteDialogFor(i);
                e.stopPropagation();
              }}
            >
              <DeleteIcon />
            </div>
          </TableRowCell>
        </TableRow>
      ))
    ) : (
      <TableRow className="row-no-lines disabled">
        <TableRowCell colSpan={3}>
          {formatMessage(messages.noJourneyPatternsText)}
        </TableRowCell>
      </TableRow>
    );

  return (
    <div>
      <Table className="journey-patterns-table">
        <TableHeaderCell
          label={formatMessage(messages.nameTableHeaderCellLabel)}
        />
        <TableHeaderCell
          label={formatMessage(messages.directionTableHeaderCellLabel)}
        />
        <TableHeaderCell
          label={formatMessage(messages.stopPlacesTableHeaderCellLabel)}
        />
        <TableHeaderCell
          label={formatMessage(messages.serviceJourneysTableHeaderCellLabel)}
        />
        {tableRows}
      </Table>

      <ConfirmDialog
        isOpen={removeDialogOpenFor !== null}
        title={formatMessage(messages.deleteConfirmDialogTitle)}
        message={formatMessage(messages.deleteConfirmDialogMessage)}
        buttons={[
          <Button
            key={2}
            onClick={() => showDeleteDialogFor(null)}
            variant="secondary"
            width="md"
            className="action-button"
          >
            {formatMessage(messages.deleteConfirmDialogCancelButtonText)}
          </Button>,
          <Button
            key={1}
            onClick={doDelete}
            variant="success"
            width="md"
            className="action-button"
          >
            {formatMessage(messages.deleteConfirmDialogConfirmButtonText)}
          </Button>
        ]}
        onClose={() => showDeleteDialogFor(null)}
      />
    </div>
  );
};

JourneyPatternsTable.propTypes = {
  journeyPatterns: PropTypes.arrayOf(PropTypes.instanceOf(JourneyPattern))
    .isRequired,
  onRowClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

export default JourneyPatternsTable;
