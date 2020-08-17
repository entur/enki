import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';

import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';

import Line from 'model/Line';
import { Organisation } from 'reducers/organisations';

import DeleteButton from 'components/DeleteButton/DeleteButton';
import Loading from 'components/Loading';

import './styles.scss';

export type Props = {
  lines: Line[];
  organisations: Organisation[];
  onRowClick: (line: Line) => void;
  onDeleteRowClick: (line: Line) => void;
};

export default (props: Props) => {
  const { lines } = props;

  const { formatMessage } = useSelector(selectIntl);

  const nameTableHeader = formatMessage('linesNameTableHeaderLabel');
  const privateCodeTableHeader = formatMessage(
    'linesPrivateCodeTableHeaderLabel'
  );
  const operatorTableHeader = formatMessage('linesOperatorTableHeader');
  const noLinesFoundText = formatMessage('linesNoLinesFoundText');
  const loadingText = formatMessage('linesLoadingText');

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
      <DataCell title={line.description}>{line.name}</DataCell>
      <DataCell>{line.privateCode}</DataCell>
      <DataCell>
        {organisations?.find((op) => op.id === line.operatorRef)?.name ?? '-'}
      </DataCell>
      <DataCell className="delete-row-cell">
        <DeleteButton onClick={() => onDeleteRowClick(line)} title="" thin />
      </DataCell>
    </TableRow>
  ));
};
