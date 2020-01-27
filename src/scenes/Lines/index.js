import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  HeaderCell,
  DataCell
} from '@entur/table';
import Loading from 'components/Loading';
import { loadFlexibleLines } from 'actions/flexibleLines';
import './styles.scss';
import { createSelector } from 'reselect';
import { selectIntl } from 'i18n';
import messages from './messages';

const selectLines = createSelector(
  state => state,
  ({ organisations, flexibleLines }) =>
    flexibleLines &&
    flexibleLines.map(line => ({
      operatorName: organisations.find(o => o.id === line.operatorRef)?.name,
      ...line
    }))
);

const Lines = ({ history }) => {
  const { formatMessage } = useSelector(selectIntl);
  const lines = useSelector(selectLines);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFlexibleLines());
  }, [dispatch]);

  const handleOnRowClick = useCallback(
    id => {
      history.push(`/lines/edit/${id}`);
    },
    [history]
  );

  const renderTableRows = () => {
    if (lines) {
      return lines.length > 0 ? (
        lines.map(line => (
          <TableRow key={line.id} onClick={() => handleOnRowClick(line.id)}>
            <DataCell title={line.description}>{line.name}</DataCell>
            <DataCell>{line.privateCode}</DataCell>
            <DataCell>{line.operatorName}</DataCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-lines disabled">
          <DataCell colSpan={3}>
            {formatMessage(messages.noLinesFoundText)}
          </DataCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <DataCell colSpan={3}>
            <Loading text={formatMessage(messages.loadingText)} />
          </DataCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="lines">
      <h2>{formatMessage(messages.header)}</h2>

      <SecondaryButton as={Link} to="/lines/create" className="new-line-button">
        <AddIcon />
        {formatMessage(messages.createLineIconButtonLabel)}
      </SecondaryButton>

      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell>
              {formatMessage(messages.nameTableHeaderLabel)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.privateCodeTableHeaderLabel)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.operatorTableHeader)}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </div>
  );
};

export default withRouter(Lines);
