import React, { Component } from 'react';
import { Button, Label, TextField } from '@entur/component-library';

import FlexibleStopPlaceMap from './components/FlexibleStopPlaceMap';

import './styles.css';

class FlexibleStopPlaceEditor extends Component {
  state = {
    name: '',
    validity: '',
    polygon: []
  };

  onFieldChange(field, value) {
    this.setState({ [field]: value });
  }

  handleMapOnClick(e) {
    this.setState(prevState => ({
      polygon: prevState.polygon.concat([[e.latlng.lat, e.latlng.lng]])
    }));
  }

  render() {
    const { name, validity, polygon } = this.state;

    return (
      <div className="flexible-stop-place-editor">
        <h3>Opprett fleksibelt stoppested</h3>

        <div className="stop-place-form">
          <div>
            <Label>Navn</Label>
            <TextField
              type="string"
              value={name}
              onChange={e => this.onFieldChange('name', e.target.value)}
            />
          </div>

          <div>
            <Label>Validity</Label>
            <TextField
              type="string"
              value={validity}
              onChange={e => this.onFieldChange('validity', e.target.value)}
            />
          </div>

          <div className="save-button-container">
            <Button variant="success">Lagre</Button>
          </div>
        </div>

        <FlexibleStopPlaceMap
          onClick={::this.handleMapOnClick}
          polygon={polygon}
        />
      </div>
    );
  }
}

export default FlexibleStopPlaceEditor;
