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
import './styles.scss';
import { GlobalState } from 'reducers';
import FlexibleStopPlace from 'model/FlexibleStopPlace';

type Props = {
  stopPoints: StopPoint[];
  onRowClick: (i: number) => void;
  onDeleteClick: (sp: number | null) => void;
};

const StopPointsTable = ({ stopPoints, onRowClick, onDeleteClick }: Props) => {
  const [removeDialogOpenFor, setRemoveDialogOpenFor] = useState<number | null>(
    null
  );
  const flexibleStopPlaces = useSelector<
    GlobalState,
    FlexibleStopPlace[] | null
  >((state) => state.flexibleStopPlaces);
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
              ? flexibleStopPlaces?.find(
                  (fsp: FlexibleStopPlace) => fsp.id === sp.flexibleStopPlaceRef
                )?.name
              : // prettier-ignore
              //@ts-ignore: 27.02.2020 - Checka vad sp.Ref skal vara
              sp.Ref
              ? sp.quayRef
              : formatMessage('tableDefaultValue')}
          </DataCell>
          <DataCell>
            {sp.destinationDisplay ? sp.destinationDisplay.frontText : ''}
          </DataCell>
          <DataCell>
            {sp.forBoarding ? formatMessage('yes') : formatMessage('no')}
          </DataCell>
          <DataCell>
            {sp.forAlighting ? formatMessage('yes') : formatMessage('no')}
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
        <DataCell colSpan={3}>{formatMessage('tableNoStopPoints')}</DataCell>
      </TableRow>
    );

  return (
    <div>
      <Table className="stop-points-table">
        <TableHead>
          <TableRow>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>{formatMessage('tableName')}</HeaderCell>
            <HeaderCell>{formatMessage('tableFrontText')}</HeaderCell>
            <HeaderCell>{formatMessage('tableBoarding')}</HeaderCell>
            <HeaderCell>{formatMessage('tableAlighting')}</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>

      <ConfirmDialog
        isOpen={removeDialogOpenFor !== null}
        title={formatMessage('tableDeleteTitle')}
        message={formatMessage('tableDeleteMessage')}
        buttons={[
          <SecondaryButton key={2} onClick={() => setRemoveDialogOpenFor(null)}>
            {formatMessage('no')}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={() => doDelete()}>
            {formatMessage('yes')}
          </SuccessButton>,
        ]}
        onDismiss={() => setRemoveDialogOpenFor(null)}
      />
    </div>
  );
};

export default StopPointsTable;
