import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import { AddIcon, DownloadIcon } from '@entur/icons';
import { FormattedDate } from 'react-intl';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  HeaderCell,
  DataCell
} from '@entur/table';
import Loading from 'components/Loading';
import { SecondaryButton } from '@entur/button';
import { loadExports } from 'actions/exports';
import { EXPORT_STATUS } from 'model/enums';

import './styles.scss';
import { getIconForStatus } from './scenes/icons';
import { selectIntl } from 'i18n';
import messages from './exports.messages';

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
            <DataCell>{e.name}</DataCell>
            <DataCell>{getIconForStatus(e.exportStatus)}</DataCell>
            <DataCell>
              {e.exportStatus === EXPORT_STATUS.SUCCESS && (
                <SecondaryButton
                  width="square"
                  onClick={event => {
                    event.stopPropagation();
                    e.download();
                  }}
                >
                  <DownloadIcon />
                </SecondaryButton>
              )}
            </DataCell>
            <DataCell>
              {e.dryRun
                ? formatMessage(messages.dryRunYes)
                : formatMessage(messages.dryRunNo)}
            </DataCell>
            <DataCell>
              <FormattedDate value={moment(e.fromDate)} />
            </DataCell>
            <DataCell>
              <FormattedDate value={moment(e.toDate)} />
            </DataCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-exports disabled">
          <DataCell colSpan={6}>
            {formatMessage(messages.noExportsFoundText)}
          </DataCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <DataCell colSpan={6}>
            <Loading text={formatMessage(messages.loadingExportsText)} />
          </DataCell>
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
        <TableHead>
          <TableRow>
            <HeaderCell>
              {formatMessage(messages.tableHeaderLabelName)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.tableHeaderLabelStatus)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.tableHeaderLabelDownload)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.tableHeaderLabelDryrun)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.tableHeaderLabelFromDate)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.tableHeaderLabelToDate)}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </div>
  );
};

export default withRouter(Exports);
