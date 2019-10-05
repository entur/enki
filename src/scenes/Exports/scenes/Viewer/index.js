import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { Label } from '@entur/component-library';

import { loadExportById } from '../../../../actions/exports';
import Loading from '../../../../components/Loading';
import { EXPORT_STATUS } from '../../../../model/enums';
import { API_BASE } from '../../../../http/http';

import './styles.css';
import { createSelector } from 'reselect';
import { getIconForStatus, getIconForSeverity } from '../icons';

const selectExport = createSelector(
  state => state.exports,
  (_, match) => match.params.id,
  (theExports, id) => theExports ? theExports.find(e => e.id === id) : null
)

const getDownloadUrl = (relativeUrl) => {
  return API_BASE + '/uttu/' + relativeUrl;
}

const ExportsViewer = ({ match, history }) => {
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
        <h2>Vis eksport</h2>
      </div>

      {theExport ? (
        <div className="export-view">
          <Label>Navn</Label>
          <div className="value">{theExport.name}</div>

          <Label>Fra dato</Label>
          <div className="value">
            {moment(theExport.fromDate).format('DD.MM.YYYY')}
          </div>

          <Label>Til dato</Label>
          <div className="value">
            {moment(theExport.toDate).format('DD.MM.YYYY')}
          </div>

          <Label>Tørrkjøring</Label>
          <div className="value">{theExport.dryRun ? 'Ja' : 'Nei'}</div>

          <Label>Status</Label>
          <div className="value status">
            <div className="icon">
              {getIconForStatus(theExport.exportStatus)}
            </div>
            <div>{theExport.exportStatus}</div>
          </div>

          {theExport.exportStatus === EXPORT_STATUS.SUCCESS && (
            <Fragment>
              <Label>Last ned eksporterte filer</Label>
              <div className="value">
                <a href={getDownloadUrl(theExport.downloadUrl)}>
                  Last ned
                </a>
              </div>
            </Fragment>
          )}

          {theExport.messages.length > 0 && (
            <Fragment>
              <Label>Meldinger</Label>
              <div className="value messages">
                {theExport.messages.map((m, i) => (
                  <div key={i} className="message">
                    <div className="icon">
                      {getIconForSeverity(m.severity)}
                    </div>
                    <div>{m.message}</div>
                  </div>
                ))}
              </div>
            </Fragment>
          )}
        </div>
      ) : (
        <Loading text="Laster inn eksport..." />
      )}
    </div>
  );
}

export default withRouter(ExportsViewer);
