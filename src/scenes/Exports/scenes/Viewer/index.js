import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { Label, ExclamationIcon, ErrorIcon } from '@entur/component-library';

import { loadExportById, saveExport } from '../../../../actions/exports';
import Loading from '../../../../components/Loading';
import { EXPORT_STATUS, SEVERITY } from '../../../../model/enums';

import './styles.css';

class ExportsViewer extends Component {
  state = { theExport: null };

  componentDidMount() {
    const { dispatch, match, history } = this.props;
    dispatch(loadExportById(match.params.id))
      .then(theExport => this.setState({ theExport }))
      .catch(() => history.push('/exports'));
  }

  handleFieldChange(field, value) {
    this.setState(({ theExport }) => ({
      theExport: theExport.withChanges({ [field]: value })
    }));
  }

  handleOnSaveClick() {
    const { dispatch, history } = this.props;
    this.setState({ isSaving: true });
    dispatch(saveExport(this.state.theExport))
      .then(() => history.push('/exports'))
      .finally(() => this.setState({ isSaving: false }));
  }

  static getIconForSeverity(severity) {
    switch (severity) {
      case SEVERITY.INFO:
        return <ExclamationIcon color="#000000" />;
      case SEVERITY.WARN:
        return <ErrorIcon color="rgba(255,234,0,1)" />;
      case SEVERITY.ERROR:
        return <ErrorIcon color="rgba(255,0,0,1)" />;
    }
  }

  render() {
    const { theExport } = this.state;

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
            <div className="value">{theExport.exportStatus}</div>

            {theExport.exportStatus === EXPORT_STATUS.SUCCESS && (
              <Fragment>
                <Label>URL for nedlasting</Label>
                <div className="value">
                  <a href={theExport.downloadUrl}>{theExport.downloadUrl}</a>
                </div>
              </Fragment>
            )}

            <Label>Meldinger</Label>
            <div className="value messages">
              {theExport.messages.map((m, i) => (
                <div key={i} className="message">
                  <div className="icon">
                    {ExportsViewer.getIconForSeverity(m.severity)}
                  </div>
                  <div>{m.message}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Loading text="Laster inn eksport..." />
        )}
      </div>
    );
  }
}

export default compose(withRouter, connect())(ExportsViewer);
