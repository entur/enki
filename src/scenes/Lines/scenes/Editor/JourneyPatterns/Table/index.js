import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { DeleteIcon } from '@entur/icons';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/table';
import { JourneyPattern } from 'model';
import ConfirmDialog from 'components/ConfirmDialog';

import './styles.scss';
import { selectIntl } from 'i18n';

const JourneyPatternsTable = ({
  journeyPatterns,
  onRowClick,
  onDeleteClick,
}) => {
  const { formatMessage } = useSelector(selectIntl);
  const [removeDialogOpenFor, setRemoveDialogOpenFor] = useState(null);

  const showDeleteDialogFor = (journeyPattern) => {
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
              : formatMessage('tableNewJourneyPatternDefaultText')}
          </DataCell>
          <DataCell>{jp.directionType || ''}</DataCell>
          <DataCell>{jp.pointsInSequence.length}</DataCell>
          <DataCell>{jp.serviceJourneys.length}</DataCell>
          <DataCell>
            <div
              onClick={(e) => {
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
          {formatMessage('tableNoJourneyPatternsText')}
        </DataCell>
      </TableRow>
    );

  return (
    <div>
      <Table className="journey-patterns-table">
        <TableHead>
          <TableRow>
            <HeaderCell>
              {formatMessage('tableNameTableHeaderCellLabel')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('tableDirectionTableHeaderCellLabel')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('tableStopPlacesTableHeaderCellLabel')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('tableServiceJourneysTableHeaderCellLabel')}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>

      <ConfirmDialog
        isOpen={removeDialogOpenFor !== null}
        title={formatMessage('tableDeleteConfirmDialogTitle')}
        message={formatMessage('tableDeleteConfirmDialogMessage')}
        buttons={[
          <SecondaryButton key={2} onClick={() => showDeleteDialogFor(null)}>
            {formatMessage('tableDeleteConfirmDialogCancelButtonText')}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={doDelete}>
            {formatMessage('tableDeleteConfirmDialogConfirmButtonText')}
          </SuccessButton>,
        ]}
        onDismiss={() => showDeleteDialogFor(null)}
      />
    </div>
  );
};

JourneyPatternsTable.propTypes = {
  journeyPatterns: PropTypes.arrayOf(PropTypes.instanceOf(JourneyPattern))
    .isRequired,
  onRowClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default JourneyPatternsTable;
