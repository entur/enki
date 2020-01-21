import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import { AddIcon } from '@entur/icons';
import { FormattedDate } from 'react-intl';
import {
  Table,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from 'components/Table';
import Loading from 'components/Loading';
import { SecondaryButton } from '@entur/button';
import { loadExports } from 'actions/exports';
import { EXPORT_STATUS } from 'model/enums';

import './styles.scss';
import { getIconForStatus } from './scenes/icons';
import { selectIntl } from 'i18n';
import messages from './exports.messages';
import { PrimaryButton } from '@entur/button';

const Exports = ({ history }) => {
  const exports = useSelector(({ exports }) => exports);
  const { formatMessage } = useSelector(selectIntl);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadExports());
  }, [dispatch]);

  const handleOnRowClick = id => {
    history.push(`/exports/view/${id}`);
  };

  const renderTableRows = () => {
    if (exports) {
      return exports.length > 0 ? (
        exports.map(e => (
          <TableRow key={e.id} onClick={() => handleOnRowClick(e.id)}>
            <TableRowCell>{e.name}</TableRowCell>
            <TableRowCell>{getIconForStatus(e.exportStatus)}</TableRowCell>
            <TableRowCell>
              {e.exportStatus === EXPORT_STATUS.SUCCESS && (
                <PrimaryButton
                  onClick={event => {
                    event.stopPropagation();
                    e.download();
                  }}
                >
                  {formatMessage(messages.downloadLinkText)}
                </PrimaryButton>
              )}
            </TableRowCell>
            <TableRowCell>
              {e.dryRun
                ? formatMessage(messages.dryRunYes)
                : formatMessage(messages.dryRunNo)}
            </TableRowCell>
            <TableRowCell>
              <FormattedDate value={moment(e.fromDate)} />
            </TableRowCell>
            <TableRowCell>
              <FormattedDate value={moment(e.toDate)} />
            </TableRowCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-exports disabled">
          <TableRowCell colSpan={6}>
            {formatMessage(messages.noExportsFoundText)}
          </TableRowCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <TableRowCell colSpan={6}>
            <Loading text={formatMessage(messages.loadingExportsText)} />
          </TableRowCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="exports">
      <h2>{formatMessage(messages.header)}</h2>

      <SecondaryButton
        as={Link}
        to="/exports/create"
        className="create-export-button"
      >
        <AddIcon />
        {formatMessage(messages.createExportButtonLabel)}
      </SecondaryButton>

      <Table>
        <TableHeaderCell label={formatMessage(messages.tableHeaderLabelName)} />
        <TableHeaderCell
          label={formatMessage(messages.tableHeaderLabelStatus)}
        />
        <TableHeaderCell
          label={formatMessage(messages.tableHeaderLabelDownload)}
        />
        <TableHeaderCell
          label={formatMessage(messages.tableHeaderLabelDryrun)}
        />
        <TableHeaderCell
          label={formatMessage(messages.tableHeaderLabelFromDate)}
        />
        <TableHeaderCell
          label={formatMessage(messages.tableHeaderLabelToDate)}
        />

        {renderTableRows()}
      </Table>
    </div>
  );
};

export default withRouter(Exports);
