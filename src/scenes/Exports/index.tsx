import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AddIcon, DownloadIcon } from '@entur/icons';
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
import { useAuth } from '@entur/auth-provider';
import { useConfig } from 'config/ConfigContext';
import { useAppDispatch } from 'app/hooks';

const Exports = () => {
  const navigate = useNavigate();
  const exports = useSelector<GlobalState, ExportsState>(
    (state) => state.exports
  );
  const { formatMessage, locale } = useSelector<GlobalState, AppIntlState>(
    selectIntl
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadExports());
  }, [dispatch]);

  const auth = useAuth();

  const { uttuApiUrl } = useConfig();

  const handleOnRowClick = (id: string) => {
    navigate(`/exports/view/${id}`);
  };

  const renderTableRows = () => {
    if (exports) {
      return exports.length > 0 ? (
        exports.map((e) => (
          <TableRow key={e.id} onClick={() => handleOnRowClick(e.id ?? '')}>
            <DataCell>{e.name}</DataCell>
            <DataCell>{getIconForStatus(e.exportStatus)}</DataCell>
            <DataCell>{new Date(e.created!).toLocaleString(locale)}</DataCell>
            <DataCell>
              {e.exportStatus === EXPORT_STATUS.SUCCESS && (
                <SecondarySquareButton
                  onClick={async (event: React.MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    download(uttuApiUrl, e, await auth.getAccessToken());
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
              {formatMessage('exportsTableHeaderLabelCreated')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('exportsTableHeaderLabelDownload')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('exportsTableHeaderLabelDryrun')}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </div>
  );
};

export default Exports;
