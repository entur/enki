import { useAuth } from '@entur/auth-provider';
import { SecondaryButton, SecondarySquareButton } from '@entur/button';
import { AddIcon, DownloadIcon } from '@entur/icons';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { Heading1 } from '@entur/typography';
import { loadExports } from 'actions/exports';
import { useAppDispatch } from 'app/hooks';
import Loading from 'components/Loading';
import { useConfig } from 'config/ConfigContext';
import { download } from 'model/Export';
import { EXPORT_STATUS } from 'model/enums';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalState } from 'reducers';
import { ExportsState } from 'reducers/exports';
import { getIconForStatus } from './scenes/icons';
import './styles.scss';

const Exports = () => {
  const navigate = useNavigate();
  const exports = useSelector<GlobalState, ExportsState>(
    (state) => state.exports
  );
  const intl = useIntl();
  const { formatMessage, locale } = intl;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadExports(intl));
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
                ? formatMessage({ id: 'exportsDryRunYes' })
                : formatMessage({ id: 'exportsDryRunNo' })}
            </DataCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-exports disabled">
          <DataCell colSpan={6}>
            {formatMessage({ id: 'exportsNoExportsFoundText' })}
          </DataCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <DataCell colSpan={6}>
            <Loading
              text={formatMessage({ id: 'exportsLoadingExportsText' })}
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
      <Heading1>{formatMessage({ id: 'exportsHeader' })}</Heading1>

      <SecondaryButton
        as={Link}
        to="/exports/create"
        className="create-export-button"
      >
        <AddIcon />
        {formatMessage({ id: 'exportsCreateExportButtonLabel' })}
      </SecondaryButton>

      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell>
              {formatMessage({ id: 'exportsTableHeaderLabelName' })}
            </HeaderCell>
            <HeaderCell>
              {formatMessage({ id: 'exportsTableHeaderLabelStatus' })}
            </HeaderCell>
            <HeaderCell>
              {formatMessage({ id: 'exportsTableHeaderLabelCreated' })}
            </HeaderCell>
            <HeaderCell>
              {formatMessage({ id: 'exportsTableHeaderLabelDownload' })}
            </HeaderCell>
            <HeaderCell>
              {formatMessage({ id: 'exportsTableHeaderLabelDryrun' })}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </div>
  );
};

export default Exports;
