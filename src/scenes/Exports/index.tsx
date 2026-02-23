import Add from '@mui/icons-material/Add';
import Download from '@mui/icons-material/Download';
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { loadExports } from 'actions/exports';
import { useAuth } from 'auth/auth';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import Loading from 'components/Loading';
import { useConfig } from 'config/ConfigContext';
import { download } from 'model/Export';
import { EXPORT_STATUS } from 'model/enums';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { ExportsState } from 'reducers/exportsSlice';
import { getIconForStatus } from './icons/icons';

const Exports = () => {
  const navigate = useNavigate();
  const exports: ExportsState = useAppSelector((state) => state.exports);
  const intl = useIntl();
  const { formatMessage, locale } = intl;
  const { hideExportDryRun } = useConfig();

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
            <TableCell>{e.name}</TableCell>
            <TableCell>{getIconForStatus(e.exportStatus)}</TableCell>
            <TableCell>{new Date(e.created!).toLocaleString(locale)}</TableCell>
            <TableCell>
              {e.exportStatus === EXPORT_STATUS.SUCCESS && (
                <IconButton
                  size="small"
                  onClick={async (event: React.MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    download(uttuApiUrl, e, await auth.getAccessToken(), intl);
                  }}
                >
                  <Download />
                </IconButton>
              )}
            </TableCell>
            {!hideExportDryRun && (
              <TableCell>
                {e.dryRun
                  ? formatMessage({ id: 'exportsDryRunYes' })
                  : formatMessage({ id: 'exportsDryRunNo' })}
              </TableCell>
            )}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={6}>
            {formatMessage({ id: 'exportsNoExportsFoundText' })}
          </TableCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow>
          <TableCell colSpan={6}>
            <Loading
              text={formatMessage({ id: 'exportsLoadingExportsText' })}
              isLoading={!exports}
              children={null}
            />
          </TableCell>
        </TableRow>
      );
    }
  };

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <Typography variant="h1">
        {formatMessage({ id: 'exportsHeader' })}
      </Typography>

      <Button
        variant="outlined"
        component={Link}
        to="/exports/create"
        startIcon={<Add />}
        sx={{ alignSelf: 'flex-start' }}
      >
        {formatMessage({ id: 'exportsCreateExportButtonLabel' })}
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {formatMessage({ id: 'exportsTableHeaderLabelName' })}
              </TableCell>
              <TableCell>
                {formatMessage({ id: 'exportsTableHeaderLabelStatus' })}
              </TableCell>
              <TableCell>
                {formatMessage({ id: 'exportsTableHeaderLabelCreated' })}
              </TableCell>
              <TableCell>
                {formatMessage({ id: 'exportsTableHeaderLabelDownload' })}
              </TableCell>
              {!hideExportDryRun && (
                <TableCell>
                  {formatMessage({ id: 'exportsTableHeaderLabelDryrun' })}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default Exports;
