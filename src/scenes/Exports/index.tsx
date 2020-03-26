import React, { ChangeEvent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import moment from 'moment';
import { AddIcon, DownloadIcon } from '@entur/icons';
import { FormattedDate, IntlFormatters } from 'react-intl';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/table';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import { SecondaryButton, SecondarySquareButton } from '@entur/button';
import { loadExports } from 'actions/exports';
import { EXPORT_STATUS } from 'model/enums';

import './styles.scss';
import { getIconForStatus } from './scenes/icons';
import { selectIntl } from 'i18n';
import messages from './exports.messages';
import { GlobalState } from 'reducers';
import { ExportsState } from 'reducers/exports';
import { download } from 'model/Export';

const Exports = ({ history }: RouteComponentProps) => {
  const exports = useSelector<GlobalState, ExportsState>(
    (state) => state.exports
  );
  const { formatMessage } = useSelector<GlobalState, IntlFormatters>(
    selectIntl
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadExports());
  }, [dispatch]);

  const handleOnRowClick = (id: string) => {
    history.push(`/exports/view/${id}`);
  };

  const renderTableRows = () => {
    if (exports) {
      return exports.length > 0 ? (
        exports.map((e) => (
          <TableRow key={e.id} onClick={() => handleOnRowClick(e.id ?? '')}>
            <DataCell>{e.name}</DataCell>
            <DataCell>{getIconForStatus(e.exportStatus)}</DataCell>
            <DataCell>
              {e.exportStatus === EXPORT_STATUS.SUCCESS && (
                <SecondarySquareButton
                  onClick={(event: ChangeEvent) => {
                    event.stopPropagation();
                    download(e);
                  }}
                >
                  <DownloadIcon />
                </SecondarySquareButton>
              )}
            </DataCell>
            <DataCell>
              {e.dryRun
                ? formatMessage(messages.dryRunYes)
                : formatMessage(messages.dryRunNo)}
            </DataCell>
            <DataCell>
              <FormattedDate value={moment(e.fromDate).toDate()} />
            </DataCell>
            <DataCell>
              <FormattedDate value={moment(e.toDate).toDate()} />
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
            <Loading
              text={formatMessage(messages.loadingExportsText)}
              isLoading={!exports}
              children={null}
              className=""
            />
          </DataCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="exports">
      <PageHeader
        title={formatMessage(messages.header)}
        withBackButton={false}
      />

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
