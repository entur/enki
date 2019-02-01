import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { Button, Label, TextField, Checkbox } from '@entur/component-library';

import { Export } from '../../../../model';
import { loadExportById, saveExport } from '../../../../actions/exports';
import OverlayLoader from '../../../../components/OverlayLoader';
import Loading from '../../../../components/Loading';
import CustomDatepicker from '../../../../components/CustomDatepicker';

import './styles.css';

class ExportsEditor extends Component {
  state = {
    theExport: null,
    isSaving: false
  };

  componentDidMount() {
    const { dispatch, match, history } = this.props;

    if (match.params.id) {
      dispatch(loadExportById(match.params.id))
        .then(theExport => this.setState({ theExport }))
        .catch(() => history.push('/exports'));
    } else {
      const today = moment().format('YYYY-MM-DD');
      this.setState({
        theExport: new Export({ fromDate: today, toDate: today })
      });
    }
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

  render() {
    const { match } = this.props;
    const { theExport, isSaving } = this.state;

    return (
      <div className="export-editor">
        <div className="header">
          <h2>{match.params.id ? 'Vis' : 'Opprett'} eksport</h2>

          <div className="buttons">
            <Button variant="success" onClick={::this.handleOnSaveClick}>
              Lagre
            </Button>
          </div>
        </div>

        {theExport ? (
          <OverlayLoader isLoading={isSaving} text="Lagrer eksporten...">
            <div className="export-form">
              <Label>* Navn</Label>
              <TextField
                type="text"
                value={theExport.name}
                onChange={e => this.handleFieldChange('name', e.target.value)}
              />

              <Label>* Fra dato</Label>
              <CustomDatepicker
                startDate={theExport.fromDate}
                onChange={date => this.handleFieldChange('fromDate', date)}
              />

              <Label>* Til dato</Label>
              <CustomDatepicker
                startDate={theExport.toDate}
                onChange={date => this.handleFieldChange('toDate', date)}
              />

              <Label>Tørrkjøring</Label>
              <Checkbox
                value="1"
                checked={theExport.dryRun === true}
                onChange={e =>
                  this.handleFieldChange('dryRun', e.target.checked)
                }
              />
            </div>
          </OverlayLoader>
        ) : (
          <Loading text="Laster inn eksport..." />
        )}
      </div>
    );
  }
}

export default compose(withRouter, connect())(ExportsEditor);
