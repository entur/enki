import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  ChangeEvent
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { FormattedDate, IntlFormatters } from 'react-intl';
import moment from 'moment';
import { PrimaryButton } from '@entur/button';
import { Label } from '@entur/typography';
import { DownloadIcon } from '@entur/icons';

import { loadExportById } from 'actions/exports';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import { EXPORT_STATUS } from 'model/enums';

import './styles.scss';
import { getIconForStatus, getIconForSeverity } from '../icons';

import messages, { exportStatuses, exportMessages } from './viewer.messages';
import { selectIntl } from 'i18n';
import { MatchParams } from 'http/http';
import { GlobalState } from 'reducers';
import { download, Export } from 'model/Export';

const getCurrentExport = (
  state: GlobalState,
  match: { params: MatchParams }
): Export | undefined => state.exports?.find(e => e.id === match.params.id);

const ExportsViewer = ({
  match,
  history
}: RouteComponentProps<MatchParams>) => {
  const { formatMessage } = useSelector<GlobalState, IntlFormatters>(
    selectIntl
  );

  const currentExport = useSelector<GlobalState, Export | undefined>(state =>
    getCurrentExport(state, match)
  );

  const [theExport, setTheExport] = useState(currentExport);

  const dispatch = useDispatch();

  const dispatchLoadExport = useCallback(() => {
    if (match.params.id) {
      dispatch<any>(loadExportById(match.params.id)).catch(() =>
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
        <PageHeader withBackButton title={formatMessage(messages.header)} />
      </div>

      {theExport ? (
        <div className="export-view">
          <Label>{formatMessage(messages.nameLabel)}</Label>
          <div className="value">{theExport.name}</div>

          <Label>{formatMessage(messages.fromDateLabel)}</Label>
          <div className="value">
            <FormattedDate value={moment(theExport.fromDate).toDate()} />
          </div>

          <Label>{formatMessage(messages.toDateLabel)}</Label>
          <div className="value">
            <FormattedDate value={moment(theExport.toDate).toDate()} />
          </div>

          <Label>{formatMessage(messages.dryRunLabel)}</Label>
          <div className="value">
            {theExport.dryRun
              ? formatMessage(messages.dryRunYes)
              : formatMessage(messages.dryRunNo)}
          </div>

          <Label>{formatMessage(messages.statusLabel)}</Label>
          <div className="value status">
            <div className="icon">
              {getIconForStatus(theExport.exportStatus)}
            </div>
            <div>
              {theExport.exportStatus &&
                formatMessage(exportStatuses[theExport.exportStatus])}
            </div>
          </div>

          {theExport.exportStatus === EXPORT_STATUS.SUCCESS && (
            <Fragment>
              <Label>{formatMessage(messages.downloadLabel)}</Label>
              <div className="value download">
                <PrimaryButton
                  onClick={(event: ChangeEvent) => {
                    event.stopPropagation();
                    download(theExport);
                  }}
                >
                  <DownloadIcon />
                  {formatMessage(messages.downloadLinkText)}
                </PrimaryButton>
              </div>
            </Fragment>
          )}

          {(theExport?.messages ?? []).length > 0 && (
            <Fragment>
              <Label>{formatMessage(messages.messagesLabel)}</Label>
              <div className="value messages">
                {(theExport?.messages ?? []).map((m, i) => (
                  <div key={i} className="message">
                    <div className="icon">{getIconForSeverity(m.severity)}</div>
                    <div>
                      {m?.message &&
                      Object.keys(exportMessages).includes(m.message)
                        ? formatMessage(exportMessages[m.message])
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
          text={formatMessage(messages.loadingText)}
          isLoading={!theExport}
          className=""
          children={null}
        />
      )}
    </div>
  );
};

export default withRouter(ExportsViewer);
