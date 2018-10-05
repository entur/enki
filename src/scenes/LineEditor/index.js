import React, { Component } from 'react';
import {
  Button,
  Label,
  TextField,
  DropDown,
  DropDownOptions
} from '@entur/component-library';

import './styles.css';

class LineEditor extends Component {
  state = {
    authority: '',
    operator: '',
    lineNumber: '',
    dayTypes: '',
    bookingReference: '',
    stopPlace: '-1'
  };

  onFieldChange(field, value) {
    this.setState({ [field]: value });
  }

  render() {
    const {
      authority,
      operator,
      lineNumber,
      dayTypes,
      bookingReference,
      stopPlace
    } = this.state;

    return (
      <div className="line-editor">
        <h3>Opprett fleksibel linje</h3>

        <div className="line-form">
          <Label>Autoritet</Label>
          <TextField
            type="string"
            value={authority}
            onChange={e => this.onFieldChange('authority', e.target.value)}
          />

          <Label>Operatør</Label>
          <TextField
            type="string"
            value={operator}
            onChange={e => this.onFieldChange('operator', e.target.value)}
          />

          <Label>Linjenummer</Label>
          <TextField
            type="string"
            value={lineNumber}
            onChange={e => this.onFieldChange('lineNumber', e.target.value)}
          />

          <Label>Tidspunkter</Label>
          <TextField
            type="string"
            value={dayTypes}
            onChange={e => this.onFieldChange('dayTypes', e.target.value)}
          />

          <Label>Bestillingsreferanse</Label>
          <TextField
            type="string"
            value={bookingReference}
            onChange={e =>
              this.onFieldChange('bookingReference', e.target.value)
            }
          />

          <Label>Fleksibelt stoppested</Label>
          <DropDown value={stopPlace}>
            <DropDownOptions label="- Velg stoppested -" value="-1" disabled />
          </DropDown>

          <div className="save-button-container">
            <Button variant="success">Lagre</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default LineEditor;
