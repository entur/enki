import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedDate } from 'react-intl';
import moment from 'moment';
import { Label } from '@entur/component-library';

import { loadExportById } from '../../../../actions/exports';
import Loading from '../../../../components/Loading';
import { EXPORT_STATUS } from '../../../../model/enums';
import { API_BASE } from '../../../../http/http';

import './styles.css';
import { createSelector } from 'reselect';
import { getIconForStatus, getIconForSeverity } from '../icons';

import messages, {exportStatuses, exportMessages} from './viewer.messages';
import { selectIntl } from '../../../../i18n';

const selectExport = createSelector(
  state => state.exports,
  (_, match) => match.params.id,
  (theExports, id) => theExports ? theExports.find(e => e.id === id) : null
)

const getDownloadUrl = (relativeUrl) => {
  return API_BASE + '/uttu/' + relativeUrl;
}

const ExportsViewer = ({ match, history }) => {
  const {formatMessage} = useSelector(selectIntl);

  const currentExport = useSelector(state =>
    selectExport(state, match));

  const [theExport, setTheExport] = useState(currentExport);

  const dispatch = useDispatch();

  const dispatchLoadExport = useCallback(
    () => {
      if (match.params.id) {
        dispatch(loadExportById(match.params.id))
          .catch(() => history.push('/exports'));
      } else {
        history.push('/exports');
      }
    },
    [dispatch, match.params.id, history]
  );

  useEffect(() => {
    dispatchLoadExport();
  }, [dispatchLoadExport]);

  useEffect(() => {
    setTheExport(currentExport);
  }, [currentExport]);

  return (
    <div className="export-viewer">
      <div className="header">
        <h2>{formatMessage(messages.header)}</h2>
      </div>

      {theExport ? (
        <div className="export-view">
          <Label>{formatMessage(messages.nameLabel)}</Label>
          <div className="value">{theExport.name}</div>

          <Label>{formatMessage(messages.fromDateLabel)}</Label>
          <div className="value">
            <FormattedDate value={moment(theExport.fromDate)} />
          </div>

          <Label>{formatMessage(messages.toDateLabel)}</Label>
          <div className="value">
            <FormattedDate value={moment(theExport.toDate)} />
          </div>

          <Label>{formatMessage(messages.dryRunLabel)}</Label>
          <div className="value">{theExport.dryRun ? formatMessage(messages.dryRunYes) : formatMessage(messages.dryRunNo)}</div>

          <Label>{formatMessage(messages.statusLabel)}</Label>
          <div className="value status">
            <div className="icon">
              {getIconForStatus(theExport.exportStatus)}
            </div>
            <div>{formatMessage(exportStatuses[theExport.exportStatus])}</div>
          </div>

          {theExport.exportStatus === EXPORT_STATUS.SUCCESS && (
            <Fragment>
              <Label>{formatMessage(messages.downloadLabel)}</Label>
              <div className="value">
                <a href={getDownloadUrl(theExport.downloadUrl)}>
                  {formatMessage(messages.downloadLinkText)}
                </a>
              </div>
            </Fragment>
          )}

          {theExport.messages.length > 0 && (
            <Fragment>
              <Label>{formatMessage(messages.messagesLabel)}</Label>
              <div className="value messages">
                {theExport.messages.map((m, i) => (
                  <div key={i} className="message">
                    <div className="icon">
                      {getIconForSeverity(m.severity)}
                    </div>
                    <div>{Object.keys(exportMessages).includes(m.message) ? formatMessage(exportMessages[m.message]) : m.message}</div>
                  </div>
                ))}
              </div>
            </Fragment>
          )}
        </div>
      ) : (
        <Loading text={formatMessage(messages.loadingText)} />
      )}
    </div>
  );
}

export default withRouter(ExportsViewer);
