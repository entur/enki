import { useIntl } from 'react-intl';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import Line from 'model/Line';

import DeleteButton from 'components/DeleteButton/DeleteButton';
import Loading from 'components/Loading';

import { Organisation } from 'model/Organisation';
import './styles.scss';

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
          <TableCell>{nameTableHeader}</TableCell>
          <TableCell>{publicCodeTableHeader}</TableCell>
          <TableCell>{privateCodeTableHeader}</TableCell>
          <TableCell>{operatorTableHeader}</TableCell>
          <TableCell>{''}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{renderTableBody()}</TableBody>
    </Table>
  );
};

const renderNoLinesFound = (noLinesFoundText: string) => {
  return (
    <TableRow className="row-no-lines disabled">
      <TableCell colSpan={3}>{noLinesFoundText}</TableCell>
    </TableRow>
  );
};

const renderLoading = (loadingText: string) => {
  return (
    <TableRow className="disabled">
      <TableCell colSpan={3}>
        <Loading className="" text={loadingText} children={null} />
      </TableCell>
    </TableRow>
  );
};

const renderTableRows = (props: Props) => {
  const { lines, organisations, onRowClick, onDeleteRowClick } = props;

  return lines?.map((line) => (
    <TableRow key={line.id} onClick={() => onRowClick(line)}>
      <TableCell title={line.description || undefined}>{line.name}</TableCell>
      <TableCell>{line.publicCode}</TableCell>
      <TableCell>{line.privateCode}</TableCell>
      <TableCell>
        {organisations?.find((op) => op.id === line.operatorRef)?.name?.value ??
          '-'}
      </TableCell>
      <TableCell className="delete-row-cell">
        <DeleteButton onClick={() => onDeleteRowClick(line)} title="" thin />
      </TableCell>
    </TableRow>
  ));
};
