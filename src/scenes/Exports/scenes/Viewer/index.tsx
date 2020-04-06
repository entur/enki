import React, {
  ChangeEvent,
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import moment from 'moment';
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
import './styles.scss';
import Page from 'components/Page';

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

const exportMessages = ['NO_VALID_FLEXIBLE_LINES_IN_DATA_SPACE'];

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
                label={formatMessage('viewerFromDateLabel')}
                value={moment(theExport!.fromDate).format('DD-MM-YYYY')}
              />
              <ExportItem
                label={formatMessage('viewerToDateLabel')}
                value={moment(theExport!.toDate).format('DD-MM-YYYY')}
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
                  onClick={(event: ChangeEvent) => {
                    event.stopPropagation();
                    download(theExport!);
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
                        {m?.message && exportMessages.includes(m.message)
                          ? formatMessage(m.message)
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
