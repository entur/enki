import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';

import Line from 'model/Line';

import DeleteButton from 'components/DeleteButton/DeleteButton';
import Loading from 'components/Loading';

import './styles.scss';
import { Organisation } from 'model/Organisation';

export type Props = {
  lines?: Line[];
  organisations: Organisation[];
  onRowClick: (line: Line) => void;
  onDeleteRowClick: (line: Line) => void;
};

export default (props: Props) => {
  const { lines } = props;

  const { formatMessage } = useIntl();

  const nameTableHeader = formatMessage({ id: 'linesNameTableHeaderLabel' });
  const publicCodeTableHeader = formatMessage({
    id: 'linesPublicCodeTableHeaderLabel',
  });
  const privateCodeTableHeader = formatMessage({
    id: 'linesPrivateCodeTableHeaderLabel',
  });
  const operatorTableHeader = formatMessage({ id: 'linesOperatorTableHeader' });
  const noLinesFoundText = formatMessage({ id: 'linesNoLinesFoundText' });
  const loadingText = formatMessage({ id: 'linesLoadingText' });

  const renderTableBody = () => {
    if (!lines) {
      return renderLoading(loadingText);
    }

    if (lines.length === 0) {
      return renderNoLinesFound(noLinesFoundText);
    }

    return renderTableRows(props);
  };

  return (
    <Table className="lines-table">
      <TableHead>
        <TableRow>
          <HeaderCell>{nameTableHeader}</HeaderCell>
          <HeaderCell>{publicCodeTableHeader}</HeaderCell>
          <HeaderCell>{privateCodeTableHeader}</HeaderCell>
          <HeaderCell>{operatorTableHeader}</HeaderCell>
          <HeaderCell>{''}</HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>{renderTableBody()}</TableBody>
    </Table>
  );
};

const renderNoLinesFound = (noLinesFoundText: string) => {
  return (
    <TableRow className="row-no-lines disabled">
      <DataCell colSpan={3}>{noLinesFoundText}</DataCell>
    </TableRow>
  );
};

const renderLoading = (loadingText: string) => {
  return (
    <TableRow className="disabled">
      <DataCell colSpan={3}>
        <Loading className="" text={loadingText} children={null} />
      </DataCell>
    </TableRow>
  );
};

const renderTableRows = (props: Props) => {
  const { lines, organisations, onRowClick, onDeleteRowClick } = props;

  return lines?.map((line) => (
    <TableRow key={line.id} onClick={() => onRowClick(line)}>
      <DataCell title={line.description || undefined}>{line.name}</DataCell>
      <DataCell>{line.publicCode}</DataCell>
      <DataCell>{line.privateCode}</DataCell>
      <DataCell>
        {organisations?.find((op) => op.id === line.operatorRef)?.name?.value ??
          '-'}
      </DataCell>
      <DataCell className="delete-row-cell">
        <DeleteButton onClick={() => onDeleteRowClick(line)} title="" thin />
      </DataCell>
    </TableRow>
  ));
};
