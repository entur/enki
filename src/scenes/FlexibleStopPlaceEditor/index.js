import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Label, TextField } from '@entur/component-library';

import { FlexibleStopPlace } from '../../model';
import { createFlexibleStopPlace } from '../../actions/flexibleStopPlaces';
import Listing from './components/Listing';
import PolygonMap from './components/PolygonMap';

import './styles.css';

class FlexibleStopPlaceEditor extends Component {
  state = { fsp: new FlexibleStopPlace() };

  onFieldChange(field, value) {
    this.setState(prevState => ({
      fsp: prevState.fsp.withChanges({ [field]: value })
    }));
  }

  handleMapOnClick(e) {
    this.setState(({ fsp }) => ({
      fsp: fsp.withChanges({
        polygon: fsp.polygon.concat([[e.latlng.lat, e.latlng.lng]])
      })
    }));
  }

  handleOnSaveClick() {
    this.props.dispatch(createFlexibleStopPlace(this.state.fsp));
    this.setState({ fsp: new FlexibleStopPlace() });
  }

  render() {
    const { name, validity, polygon } = this.state.fsp;

    return (
      <div className="flexible-stop-place-editor">
        <div className="flexible-stop-place-form">
          <h3>Opprett fleksibelt stoppested</h3>

          <div className="inputs">
            <div>
              <Label>Navn</Label>
              <TextField
                type="text"
                value={name}
                onChange={e => this.onFieldChange('name', e.target.value)}
              />
            </div>

            <div>
              <Label>Gyldighet</Label>
              <TextField
                type="text"
                value={validity}
                onChange={e => this.onFieldChange('validity', e.target.value)}
              />
            </div>

            <div className="save-button-container">
              <Button variant="success" onClick={::this.handleOnSaveClick}>
                Lagre
              </Button>
            </div>
          </div>
        </div>

        <Listing />

        <PolygonMap onClick={::this.handleMapOnClick} polygon={polygon} />
      </div>
    );
  }
}

export default connect()(FlexibleStopPlaceEditor);
