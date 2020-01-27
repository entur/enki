import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@entur/component-library';
import { DeleteIcon } from '@entur/icons';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  HeaderCell,
  DataCell
} from '@entur/table';
import { JourneyPattern } from 'model';
import ConfirmDialog from 'components/ConfirmDialog';

import './styles.scss';
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
          <DataCell>
            {jp.name
              ? jp.name
              : formatMessage(messages.newJourneyPatternDefaultText)}
          </DataCell>
          <DataCell>{jp.directionType || ''}</DataCell>
          <DataCell>{jp.pointsInSequence.length}</DataCell>
          <DataCell>{jp.serviceJourneys.length}</DataCell>
          <DataCell>
            <div
              onClick={e => {
                showDeleteDialogFor(i);
                e.stopPropagation();
              }}
            >
              <DeleteIcon />
            </div>
          </DataCell>
        </TableRow>
      ))
    ) : (
      <TableRow className="row-no-lines disabled">
        <DataCell colSpan={3}>
          {formatMessage(messages.noJourneyPatternsText)}
        </DataCell>
      </TableRow>
    );

  return (
    <div>
      <Table className="journey-patterns-table">
        <TableHead>
          <TableRow>
            <HeaderCell>
              {formatMessage(messages.nameTableHeaderCellLabel)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.directionTableHeaderCellLabel)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.stopPlacesTableHeaderCellLabel)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.serviceJourneysTableHeaderCellLabel)}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
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
