import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Label,
  TextField,
  DropDown,
  DropDownOptions
} from '@entur/component-library';

import { FlexibleLine, FlexibleStopPlace } from '../../model';
import { createFlexibleLine } from '../../actions/flexibleLines';

import './styles.css';

const DEFAULT_STOP_PLACE_LABEL = '--- velg stoppested ---';
const DEFAULT_STOP_PLACE_VALUE = '-1';

class FlexibleLineEditor extends Component {
  state = {
    fl: new FlexibleLine(),
    stopPlaceSelection: DEFAULT_STOP_PLACE_VALUE
  };

  handleFieldChange(field, value) {
    this.setState(({ fl }) => ({ fl: fl.withChanges({ [field]: value }) }));
  }

  handleStopPlaceSelectionChange(stopPlaceSelection) {
    if (stopPlaceSelection !== DEFAULT_STOP_PLACE_VALUE) {
      const stopPlace = this.props.flexibleStopPlaces.find(
        fsp => fsp.name === stopPlaceSelection
      );
      this.setState(({ fl }) => ({
        fl: fl.withChanges({ stopPlace })
      }));
    }
    this.setState({ stopPlaceSelection });
  }

  handleOnSaveClick() {
    this.props.dispatch(createFlexibleLine(this.state.fl));
    this.setState({
      fl: new FlexibleStopPlace(),
      stopPlaceSelection: DEFAULT_STOP_PLACE_VALUE
    });
  }

  render() {
    const { flexibleStopPlaces } = this.props;
    const {
      authority,
      operator,
      lineNumber,
      dayTypes,
      bookingReference
    } = this.state.fl;
    const { stopPlaceSelection } = this.state;

    return (
      <div className="line-editor">
        <h3>Opprett fleksibel linje</h3>

        <div className="line-form">
          <Label>Autoritet</Label>
          <TextField
            type="text"
            value={authority}
            onChange={e => this.handleFieldChange('authority', e.target.value)}
          />

          <Label>Operatør</Label>
          <TextField
            type="text"
            value={operator}
            onChange={e => this.handleFieldChange('operator', e.target.value)}
          />

          <Label>Linjenummer</Label>
          <TextField
            type="text"
            value={lineNumber}
            onChange={e => this.handleFieldChange('lineNumber', e.target.value)}
          />

          <Label>Tidspunkter</Label>
          <TextField
            type="text"
            value={dayTypes}
            onChange={e => this.handleFieldChange('dayTypes', e.target.value)}
          />

          <Label>Bestillingsreferanse</Label>
          <TextField
            type="text"
            value={bookingReference}
            onChange={e =>
              this.handleFieldChange('bookingReference', e.target.value)
            }
          />

          <Label>Fleksibelt stoppested</Label>
          <DropDown
            value={stopPlaceSelection}
            onChange={e => this.handleStopPlaceSelectionChange(e.target.value)}
          >
            <DropDownOptions
              label={DEFAULT_STOP_PLACE_LABEL}
              value={DEFAULT_STOP_PLACE_VALUE}
              disabled
            />
            {flexibleStopPlaces.map(fsp => (
              <DropDownOptions
                key={fsp.name}
                label={fsp.name}
                value={fsp.name}
              />
            ))}
          </DropDown>

          <div className="save-button-container">
            <Button variant="success" onClick={::this.handleOnSaveClick}>
              Lagre
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ flexibleStopPlaces }) => ({
  flexibleStopPlaces
});

export default connect(mapStateToProps)(FlexibleLineEditor);
