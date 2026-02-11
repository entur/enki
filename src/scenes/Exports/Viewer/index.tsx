import Download from '@mui/icons-material/Download';
import { Button, Typography } from '@mui/material';
import { loadExportById } from 'actions/exports';
import { useAuth } from 'auth/auth';
import Loading from 'components/Loading';
import Page from 'components/Page';
import { useConfig } from 'config/ConfigContext';
import uttuMessages, { isOfUttuMessage } from 'helpers/uttu.messages';
import { download } from 'model/Export';
import { EXPORT_STATUS } from 'model/enums';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Params, useNavigate, useParams } from 'react-router-dom';
import { GlobalState } from 'reducers';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getIconForSeverity, getIconForStatus } from '../icons/icons';
import Box from '@mui/material/Box';

const ExportItem = ({
  label,
  value,
}: {
  label: string;
  value: string | ReactElement;
}) => (
  <Box sx={{ minWidth: '10rem', mr: 1.5, mb: 1.5 }}>
    <Typography variant="body2" component="label">
      {label}
    </Typography>
    <Box>{value}</Box>
  </Box>
);

const getCurrentExportSelector = (params: Params) => (state: GlobalState) =>
  state.exports?.find((e) => e.id === params.id);

const ExportsViewer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  const currentExport = useAppSelector(getCurrentExportSelector(params));
  const [theExport, setTheExport] = useState(currentExport);
  const dispatch = useAppDispatch();
  const { hideExportDryRun } = useConfig();

  const dispatchLoadExport = useCallback(() => {
    if (params.id) {
      dispatch(loadExportById(params.id, intl)).catch(() =>
        navigate('/exports'),
      );
    } else {
      navigate('/exports');
    }
  }, [dispatch, params.id, navigate]);

  useEffect(() => {
    dispatchLoadExport();
  }, [dispatchLoadExport]);

  useEffect(() => {
    setTheExport(currentExport);
  }, [currentExport]);

  const auth = useAuth();

  const { uttuApiUrl } = useConfig();

  return (
    <Page
      title={formatMessage({ id: 'viewerHeader' })}
      backButtonTitle={formatMessage({ id: 'navBarExportsMenuItemLabel' })}
    >
      <Loading
        text={formatMessage({ id: 'viewerLoadingText' })}
        isLoading={!theExport}
      >
        {() => (
          <Box>
            <Box sx={{ my: 2 }}>
              <ExportItem
                label={formatMessage({ id: 'viewerNameLabel' })}
                value={theExport!.name}
              />
              {!hideExportDryRun && (
                <ExportItem
                  label={formatMessage({ id: 'viewerDryRunLabel' })}
                  value={
                    theExport!.dryRun
                      ? formatMessage({ id: 'viewerDryRunYes' })
                      : formatMessage({ id: 'viewerDryRunNo' })
                  }
                />
              )}
              <ExportItem
                label={formatMessage({ id: 'viewerGenerateServiceLinksLabel' })}
                value={
                  theExport?.generateServiceLinks
                    ? formatMessage({ id: 'viewerGenerateServiceLinksYes' })
                    : formatMessage({ id: 'viewerGenerateServiceLinksNo' })
                }
              />
              <ExportItem
                label={formatMessage({
                  id: 'viewerIncludeDatedServiceJourneysLabel',
                })}
                value={
                  theExport?.includeDatedServiceJourneys
                    ? formatMessage({
                        id: 'viewerIncludeDatedServiceJourneysYes',
                      })
                    : formatMessage({
                        id: 'viewerIncludeDatedServiceJourneysNo',
                      })
                }
              />
              <ExportItem
                label={formatMessage({ id: 'viewerStatusLabel' })}
                value={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getIconForStatus(theExport!.exportStatus)}
                    {theExport!.exportStatus &&
                      formatMessage({ id: theExport!.exportStatus })}
                  </Box>
                }
              />
            </Box>

            {theExport!.exportStatus === EXPORT_STATUS.SUCCESS && (
              <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                <Typography variant="body2" component="label">
                  {formatMessage({ id: 'viewerDownloadLabel' })}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ alignSelf: 'flex-start' }}
                  startIcon={<Download />}
                  onClick={async (event: React.MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    download(
                      uttuApiUrl,
                      theExport!,
                      await auth.getAccessToken(),
                      intl,
                    );
                  }}
                >
                  {formatMessage({ id: 'viewerDownloadLinkText' })}
                </Button>
              </Box>
            )}
            {(theExport?.messages ?? []).length > 0 && (
              <>
                <Typography variant="body2" component="label">
                  {formatMessage({ id: 'viewerMessagesLabel' })}
                </Typography>
                <Box>
                  {(theExport?.messages ?? []).map((m, i) => (
                    <Box
                      key={`${m.severity}-${m.message}-${i}`}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mr: 1 }}
                      >
                        {getIconForSeverity(m.severity)}
                      </Box>
                      <Box>
                        {m?.message && isOfUttuMessage(m.message)
                          ? formatMessage({ id: uttuMessages[m.message] })
                          : m.message}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>
        )}
      </Loading>
    </Page>
  );
};

export default ExportsViewer;
