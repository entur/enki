import React, {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { PrimaryButton } from '@entur/button';
import { Label } from '@entur/typography';
import { DownloadIcon } from '@entur/icons';
import { loadExportById } from 'actions/exports';
import Loading from 'components/Loading';
import { EXPORT_STATUS } from 'model/enums';
import { getIconForSeverity, getIconForStatus } from '../icons';
import { AppIntlState, selectIntl } from 'i18n';
import { MatchParams } from 'http/http';
import { GlobalState } from 'reducers';
import { download, Export } from 'model/Export';
import Page from 'components/Page';
import uttuMessages, { isOfUttuMessage } from 'helpers/uttu.messages';
import './styles.scss';
import { useAuth } from '@entur/auth-provider';

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
  match: { params: MatchParams }
): Export | undefined => state.exports?.find((e) => e.id === match.params.id);

const ExportsViewer = ({
  match,
  history,
}: RouteComponentProps<MatchParams>) => {
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  const currentExport = useSelector<GlobalState, Export | undefined>((state) =>
    getCurrentExport(state, match)
  );
  const [theExport, setTheExport] = useState(currentExport);
  const dispatch = useDispatch<any>();

  const dispatchLoadExport = useCallback(() => {
    if (match.params.id) {
      dispatch(loadExportById(match.params.id)).catch(() =>
        history.push('/exports')
      );
    } else {
      history.push('/exports');
    }
  }, [dispatch, match.params.id, history]);

  useEffect(() => {
    dispatchLoadExport();
  }, [dispatchLoadExport]);

  useEffect(() => {
    setTheExport(currentExport);
  }, [currentExport]);

  const auth = useAuth();

  return (
    <Page
      className="export-viewer"
      title={formatMessage('viewerHeader')}
      backButtonTitle={formatMessage('navBarExportsMenuItemLabel')}
    >
      <Loading
        text={formatMessage('viewerLoadingText')}
        isLoading={!theExport}
        className=""
      >
        {() => (
          <div className="export-view">
            <div className="export-items">
              <ExportItem
                label={formatMessage('viewerNameLabel')}
                value={theExport!.name}
              />
              <ExportItem
                label={formatMessage('viewerDryRunLabel')}
                value={
                  theExport!.dryRun
                    ? formatMessage('viewerDryRunYes')
                    : formatMessage('viewerDryRunNo')
                }
              />
              <ExportItem
                label={formatMessage('viewerStatusLabel')}
                value={
                  <div className="export-status">
                    {getIconForStatus(theExport!.exportStatus)}
                    {theExport!.exportStatus &&
                      formatMessage(theExport!.exportStatus)}
                  </div>
                }
              />
            </div>

            {theExport!.exportStatus === EXPORT_STATUS.SUCCESS && (
              <div className="export-download">
                <Label>{formatMessage('viewerDownloadLabel')}</Label>
                <PrimaryButton
                  onClick={async (event: ChangeEvent) => {
                    event.stopPropagation();
                    download(theExport!, await auth.getAccessToken());
                  }}
                >
                  <DownloadIcon />
                  {formatMessage('viewerDownloadLinkText')}
                </PrimaryButton>
              </div>
            )}
            {(theExport?.messages ?? []).length > 0 && (
              <>
                <Label>{formatMessage('viewerMessagesLabel')}</Label>
                <div className="value messages">
                  {(theExport?.messages ?? []).map((m, i) => (
                    <div key={i} className="message">
                      <div className="icon">
                        {getIconForSeverity(m.severity)}
                      </div>
                      <div>
                        {m?.message && isOfUttuMessage(m.message)
                          ? formatMessage(uttuMessages[m.message])
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

export default withRouter(ExportsViewer);
