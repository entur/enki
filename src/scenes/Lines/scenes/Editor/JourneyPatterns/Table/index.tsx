import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { DeleteIcon } from '@entur/icons';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import ConfirmDialog from 'components/ConfirmDialog';
import { selectIntl } from 'i18n';
import JourneyPattern from 'model/JourneyPattern';
import './styles.scss';

type Props = {
  journeyPatterns: JourneyPattern[];
  onRowClick: (index: number) => void;
  onDeleteClick: (index: number) => void;
};

const JourneyPatternsTable = ({
  journeyPatterns,
  onRowClick,
  onDeleteClick,
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const [removeDialogOpenFor, setRemoveDialogOpenFor] = useState<
    number | undefined
  >(undefined);

  const doDelete = () => {
    if (removeDialogOpenFor !== undefined) {
      onDeleteClick(removeDialogOpenFor);
      setRemoveDialogOpenFor(undefined);
    }
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
                setRemoveDialogOpenFor(i);
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
        isOpen={removeDialogOpenFor !== undefined}
        title={formatMessage('tableDeleteConfirmDialogTitle')}
        message={formatMessage('tableDeleteConfirmDialogMessage')}
        buttons={[
          <SecondaryButton
            key={2}
            onClick={() => setRemoveDialogOpenFor(undefined)}
          >
            {formatMessage('tableDeleteConfirmDialogCancelButtonText')}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={doDelete}>
            {formatMessage('tableDeleteConfirmDialogConfirmButtonText')}
          </SuccessButton>,
        ]}
        onDismiss={() => setRemoveDialogOpenFor(undefined)}
      />
    </div>
  );
};

export default JourneyPatternsTable;
