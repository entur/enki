import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { FormattedDate } from 'react-intl';
import moment from 'moment';
import { PrimaryButton } from '@entur/button';
import { Label } from '@entur/typography';
import { DownloadIcon } from '@entur/icons';
import { loadExportById } from 'actions/exports';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import { EXPORT_STATUS } from 'model/enums';
import { getIconForSeverity, getIconForStatus } from '../icons';
import { AppIntlState, selectIntl } from 'i18n';
import { MatchParams } from 'http/http';
import { GlobalState } from 'reducers';
import { download, Export } from 'model/Export';
import './styles.scss';

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
    <div className="export-viewer">
      <div className="header">
        <PageHeader withBackButton title={formatMessage('viewerHeader')} />
      </div>

      {theExport ? (
        <div className="export-view">
          <Label>{formatMessage('viewerNameLabel')}</Label>
          <div className="value">{theExport.name}</div>

          <Label>{formatMessage('viewerFromDateLabel')}</Label>
          <div className="value">
            <FormattedDate value={moment(theExport.fromDate).toDate()} />
          </div>

          <Label>{formatMessage('viewerToDateLabel')}</Label>
          <div className="value">
            <FormattedDate value={moment(theExport.toDate).toDate()} />
          </div>

          <Label>{formatMessage('viewerDryRunLabel')}</Label>
          <div className="value">
            {theExport.dryRun
              ? formatMessage('viewerDryRunYes')
              : formatMessage('viewerDryRunNo')}
          </div>

          <Label>{formatMessage('viewerStatusLabel')}</Label>
          <div className="value status">
            <div className="icon">
              {getIconForStatus(theExport.exportStatus)}
            </div>
            <div>
              {theExport.exportStatus && formatMessage(theExport.exportStatus)}
            </div>
          </div>

          {theExport.exportStatus === EXPORT_STATUS.SUCCESS && (
            <Fragment>
              <Label>{formatMessage('viewerDownloadLabel')}</Label>
              <div className="value download">
                <PrimaryButton
                  onClick={(event: ChangeEvent) => {
                    event.stopPropagation();
                    download(theExport);
                  }}
                >
                  <DownloadIcon />
                  {formatMessage('viewerDownloadLinkText')}
                </PrimaryButton>
              </div>
            </Fragment>
          )}

          {(theExport?.messages ?? []).length > 0 && (
            <Fragment>
              <Label>{formatMessage('viewerMessagesLabel')}</Label>
              <div className="value messages">
                {(theExport?.messages ?? []).map((m, i) => (
                  <div key={i} className="message">
                    <div className="icon">{getIconForSeverity(m.severity)}</div>
                    <div>
                      {m?.message && exportMessages.includes(m.message)
                        ? formatMessage(m.message)
                        : m.message}
                    </div>
                  </div>
                ))}
              </div>
            </Fragment>
          )}
        </div>
      ) : (
        <Loading
          text={formatMessage('viewerLoadingText')}
          isLoading={!theExport}
          className=""
          children={null}
        />
      )}
    </div>
  );
};

export default withRouter(ExportsViewer);
