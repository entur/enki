import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import moment from 'moment';
import { AddIcon, DownloadIcon } from '@entur/icons';
import { FormattedDate } from 'react-intl';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import Loading from 'components/Loading';
import { Heading1 } from '@entur/typography';
import { SecondaryButton, SecondarySquareButton } from '@entur/button';
import { loadExports } from 'actions/exports';
import { EXPORT_STATUS } from 'model/enums';
import { getIconForStatus } from './scenes/icons';
import { AppIntlState, selectIntl } from 'i18n';
import { GlobalState } from 'reducers';
import { ExportsState } from 'reducers/exports';
import { download } from 'model/Export';
import './styles.scss';

const Exports = ({ history }: RouteComponentProps) => {
  const exports = useSelector<GlobalState, ExportsState>(
    (state) => state.exports
  );
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
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
                ? formatMessage('exportsDryRunYes')
                : formatMessage('exportsDryRunNo')}
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
            {formatMessage('exportsNoExportsFoundText')}
          </DataCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <DataCell colSpan={6}>
            <Loading
              text={formatMessage('exportsLoadingExportsText')}
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
      <Heading1>{formatMessage('exportsHeader')}</Heading1>

      <SecondaryButton
        as={Link}
        to="/exports/create"
        className="create-export-button"
      >
        <AddIcon />
        {formatMessage('exportsCreateExportButtonLabel')}
      </SecondaryButton>

      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell>
              {formatMessage('exportsTableHeaderLabelName')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('exportsTableHeaderLabelStatus')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('exportsTableHeaderLabelDownload')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('exportsTableHeaderLabelDryrun')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('exportsTableHeaderLabelFromDate')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('exportsTableHeaderLabelToDate')}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </div>
  );
};

export default withRouter(Exports);
