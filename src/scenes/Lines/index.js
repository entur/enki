import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AddIcon } from '@entur/icons';

import {
  Table,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from 'components/Table';
import Loading from 'components/Loading';
import IconButton from 'components/IconButton';
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
        lines.map(n => (
          <TableRow key={n.id} onClick={() => handleOnRowClick(n.id)}>
            <TableRowCell title={n.description}>{n.name}</TableRowCell>
            <TableRowCell>{n.privateCode}</TableRowCell>
            <TableRowCell>{n.operatorName}</TableRowCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-lines disabled">
          <TableRowCell colSpan={3}>
            {formatMessage(messages.noLinesFoundText)}
          </TableRowCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <TableRowCell colSpan={3}>
            <Loading text={formatMessage(messages.loadingText)} />
          </TableRowCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="lines">
      <h2>{formatMessage(messages.header)}</h2>

      <Link to="/lines/create">
        <IconButton
          icon={<AddIcon />}
          label={formatMessage(messages.createLineIconButtonLabel)}
          labelPosition="right"
        />
      </Link>

      <Table>
        <TableHeaderCell label={formatMessage(messages.nameTableHeaderLabel)} />
        <TableHeaderCell
          label={formatMessage(messages.privateCodeTableHeaderLabel)}
        />
        <TableHeaderCell label={formatMessage(messages.operatorTableHeader)} />

        {renderTableRows()}
      </Table>
    </div>
  );
};

export default withRouter(Lines);
