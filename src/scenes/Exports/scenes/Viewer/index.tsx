import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from '@entur/button';
import { Label } from '@entur/typography';
import { DownloadIcon } from '@entur/icons';
import { loadExportById } from 'actions/exports';
import Loading from 'components/Loading';
import { EXPORT_STATUS } from 'model/enums';
import { getIconForSeverity, getIconForStatus } from '../icons';
import { useIntl } from 'react-intl';
import { GlobalState } from 'reducers';
import { download, Export } from 'model/Export';
import Page from 'components/Page';
import uttuMessages, { isOfUttuMessage } from 'helpers/uttu.messages';
import './styles.scss';
import { useAuth } from '@entur/auth-provider';
import { useConfig } from 'config/ConfigContext';
import { useParams, Params, useNavigate } from 'react-router-dom';

const ExportItem = ({
  label,
  value,
}: {
  label: string;
  value: string | ReactElement;
}) => (
  <div className="export-item">
    <Label>{label}</Label>
    <div className="value">{value}</div>
  </div>
);

const getCurrentExport = (
  state: GlobalState,
  params: Params
): Export | undefined => state.exports?.find((e) => e.id === params.id);

const ExportsViewer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  const currentExport = useSelector<GlobalState, Export | undefined>((state) =>
    getCurrentExport(state, params)
  );
  const [theExport, setTheExport] = useState(currentExport);
  const dispatch = useDispatch<any>();

  const dispatchLoadExport = useCallback(() => {
    if (params.id) {
      dispatch(loadExportById(params.id, intl)).catch(() =>
        navigate('/exports')
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
      className="export-viewer"
      title={formatMessage({ id: 'viewerHeader' })}
      backButtonTitle={formatMessage({ id: 'navBarExportsMenuItemLabel' })}
    >
      <Loading
        text={formatMessage({ id: 'viewerLoadingText' })}
        isLoading={!theExport}
        className=""
      >
        {() => (
          <div className="export-view">
            <div className="export-items">
              <ExportItem
                label={formatMessage({ id: 'viewerNameLabel' })}
                value={theExport!.name}
              />
              <ExportItem
                label={formatMessage({ id: 'viewerDryRunLabel' })}
                value={
                  theExport!.dryRun
                    ? formatMessage({ id: 'viewerDryRunYes' })
                    : formatMessage({ id: 'viewerDryRunNo' })
                }
              />
              <ExportItem
                label={formatMessage({ id: 'viewerStatusLabel' })}
                value={
                  <div className="export-status">
                    {getIconForStatus(theExport!.exportStatus)}
                    {theExport!.exportStatus &&
                      formatMessage({ id: theExport!.exportStatus })}
                  </div>
                }
              />
            </div>

            {theExport!.exportStatus === EXPORT_STATUS.SUCCESS && (
              <div className="export-download">
                <Label>{formatMessage({ id: 'viewerDownloadLabel' })}</Label>
                <PrimaryButton
                  onClick={async (event: React.MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    download(
                      uttuApiUrl,
                      theExport!,
                      await auth.getAccessToken()
                    );
                  }}
                >
                  <DownloadIcon />
                  {formatMessage({ id: 'viewerDownloadLinkText' })}
                </PrimaryButton>
              </div>
            )}
            {(theExport?.messages ?? []).length > 0 && (
              <>
                <Label>{formatMessage({ id: 'viewerMessagesLabel' })}</Label>
                <div className="value messages">
                  {(theExport?.messages ?? []).map((m, i) => (
                    <div key={i} className="message">
                      <div className="icon">
                        {getIconForSeverity(m.severity)}
                      </div>
                      <div>
                        {m?.message && isOfUttuMessage(m.message)
                          ? formatMessage({ id: uttuMessages[m.message] })
                          : m.message}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Loading>
    </Page>
  );
};

export default ExportsViewer;
