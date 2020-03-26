import React, { useState } from 'react';
import { selectIntl } from 'i18n';
import { useSelector } from 'react-redux';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { DeleteIcon } from '@entur/icons';
import StopPoint from 'model/StopPoint';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/table';
import ConfirmDialog from 'components/ConfirmDialog';
import messages from './messages';
import './styles.scss';

type Props = {
  stopPoints: StopPoint[];
  onRowClick: (i: number) => void;
  onDeleteClick: (sp: any) => void;
};

const StopPointsTable = ({ stopPoints, onRowClick, onDeleteClick }: Props) => {
  const [removeDialogOpenFor, setRemoveDialogOpenFor] = useState<number | null>(
    null
  );
  const flexibleStopPlaces = useSelector(
    (state: any) => state.flexibleStopPlaces
  );
  const { formatMessage } = useSelector(selectIntl);

  const doDelete = () => {
    onDeleteClick(removeDialogOpenFor);
    setRemoveDialogOpenFor(null);
  };

  const tableRows =
    stopPoints.length > 0 ? (
      stopPoints.map((sp, i) => (
        <TableRow key={sp.id ?? i} onClick={() => onRowClick(i)}>
          <DataCell>{i + 1}</DataCell>
          <DataCell>
            {sp.flexibleStopPlaceRef
              ? flexibleStopPlaces.find(
                  (fsp: any) => fsp.id === sp.flexibleStopPlaceRef
                ).name
              : // prettier-ignore
              //@ts-ignore: 27.02.2020 - Checka vad sp.Ref skal vara
              sp.Ref
              ? sp.quayRef
              : formatMessage(messages.defaultValue)}
          </DataCell>
          <DataCell>
            {sp.destinationDisplay ? sp.destinationDisplay.frontText : ''}
          </DataCell>
          <DataCell>
            {sp.forBoarding
              ? formatMessage(messages.yes)
              : formatMessage(messages.no)}
          </DataCell>
          <DataCell>
            {sp.forAlighting
              ? formatMessage(messages.yes)
              : formatMessage(messages.no)}
          </DataCell>
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
        <DataCell colSpan={3}>{formatMessage(messages.noStopPoints)}</DataCell>
      </TableRow>
    );

  return (
    <div>
      <Table className="stop-points-table">
        <TableHead>
          <TableRow>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>{formatMessage(messages.name)}</HeaderCell>
            <HeaderCell>{formatMessage(messages.frontText)}</HeaderCell>
            <HeaderCell>{formatMessage(messages.boarding)}</HeaderCell>
            <HeaderCell>{formatMessage(messages.alighting)}</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>

      <ConfirmDialog
        isOpen={removeDialogOpenFor !== null}
        title={formatMessage(messages.deleteTitle)}
        message={formatMessage(messages.deleteMessage)}
        buttons={[
          <SecondaryButton key={2} onClick={() => setRemoveDialogOpenFor(null)}>
            {formatMessage(messages.no)}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={() => doDelete()}>
            {formatMessage(messages.yes)}
          </SuccessButton>,
        ]}
        onDismiss={() => setRemoveDialogOpenFor(null)}
      />
    </div>
  );
};

export default StopPointsTable;
