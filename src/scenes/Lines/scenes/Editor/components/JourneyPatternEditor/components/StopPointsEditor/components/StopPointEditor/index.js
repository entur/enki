import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Label,
  TextField,
  Checkbox,
  DropDown,
  DropDownOptions,
  Button,
  Tabs,
  Tab
} from '@entur/component-library';

import {
  DestinationDisplay,
  StopPoint
} from '../../../../../../../../../../model';
import BookingArrangementEditor from '../../../../../BookingArrangementEditor';

import './styles.css';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

const TABS = Object.freeze({
  GENERAL: 'general',
  BOOKING: 'booking'
});

class StopPointEditor extends Component {
  state = {
    stopPlaceSelection: DEFAULT_SELECT_VALUE,
    activeTab: TABS.GENERAL
  };

  componentDidMount() {
    this.setState({
      stopPlaceSelection: this.props.stopPoint.flexibleStopPlaceRef
    });
  }

  handleFieldChange(field, value) {
    const { stopPoint, onChange } = this.props;
    onChange(stopPoint.withChanges({ [field]: value }));
  }

  handleStopPlaceSelectionChange(stopPlaceSelection) {
    this.handleFieldChange(
      'flexibleStopPlaceRef',
      stopPlaceSelection !== DEFAULT_SELECT_VALUE
        ? stopPlaceSelection
        : undefined
    );
    this.setState({ stopPlaceSelection });
  }

  handleFrontTextChange(frontText) {
    const { stopPoint } = this.props;
    const destinationDisplay = stopPoint.destinationDisplay
      ? stopPoint.destinationDisplay.withChanges({ frontText })
      : new DestinationDisplay({ frontText });
    this.handleFieldChange('destinationDisplay', destinationDisplay);
  }

  render() {
    const { flexibleStopPlaces, stopPoint, isEditMode, onSave } = this.props;
    const { stopPlaceSelection, activeTab } = this.state;

    return (
      <div className="stop-point-editor">
        <div className="header">
          <h2>{isEditMode ? 'Rediger' : 'Opprett'} Stoppepunkt</h2>

          <div className="header-buttons">
            <Button variant="success" onClick={onSave}>
              Lagre
            </Button>
          </div>
        </div>

        <Tabs
          selected={activeTab}
          onChange={activeTab => this.setState({ activeTab })}
        >
          <Tab value={TABS.GENERAL} label="Generelt">
            <Label>Stoppested</Label>
            <DropDown
              value={stopPlaceSelection}
              onChange={e =>
                this.handleStopPlaceSelectionChange(e.target.value)
              }
            >
              <DropDownOptions
                label={DEFAULT_SELECT_LABEL}
                value={DEFAULT_SELECT_VALUE}
              />
              {flexibleStopPlaces.map(fsp => (
                <DropDownOptions
                  key={fsp.name}
                  label={fsp.name}
                  value={fsp.id}
                />
              ))}
            </DropDown>

            <Label>Fronttekst</Label>
            <TextField
              type="text"
              value={
                stopPoint.destinationDisplay &&
                stopPoint.destinationDisplay.frontText
                  ? stopPoint.destinationDisplay.frontText
                  : ''
              }
              onChange={e => this.handleFrontTextChange(e.target.value)}
            />

            <Label>For påstigning</Label>
            <Checkbox
              value={'1'}
              checked={stopPoint.forBoarding === true}
              onChange={e =>
                this.handleFieldChange('forBoarding', e.target.checked)
              }
            />

            <Label>For avstigning</Label>
            <Checkbox
              value={'1'}
              checked={stopPoint.forAlighting === true}
              onChange={e =>
                this.handleFieldChange('forAlighting', e.target.checked)
              }
            />
          </Tab>
          <Tab value={TABS.BOOKING} label="Bestilling">
            <BookingArrangementEditor
              bookingArrangement={stopPoint.bookingArrangement}
              onChange={b => this.handleFieldChange('bookingArrangement', b)}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

StopPointEditor.propTypes = {
  stopPoint: PropTypes.instanceOf(StopPoint).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool
};

const mapStateToProps = ({ flexibleStopPlaces }) => ({ flexibleStopPlaces });

export default connect(mapStateToProps)(StopPointEditor);
