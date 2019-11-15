import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions,
  Tabs,
  Tab
} from '@entur/component-library';

import { JourneyPattern } from 'model';
import { DIRECTION_TYPE } from 'model/enums';
import StopPointsEditor from './StopPoints';
import ServiceJourneysEditor from './ServiceJourneys';

import './styles.css';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

const TABS = Object.freeze({
  GENERAL: 'general',
  STOP_POINTS: 'stopPoints',
  SERVICE_JOURNEYS: 'serviceJourneys'
});

class JourneyPatternEditor extends Component {
  state = {
    stopPlaceSelection: DEFAULT_SELECT_VALUE,
    directionSelection: DEFAULT_SELECT_VALUE,
    activeTab: TABS.GENERAL
  };

  componentDidMount() {
    const { journeyPattern } = this.props;
    this.setState({
      stopPlaceSelection:
        journeyPattern.pointsInSequence.length > 0
          ? journeyPattern.pointsInSequence[0].flexibleStopPlaceRef
          : DEFAULT_SELECT_VALUE,
      directionSelection: journeyPattern.directionType || DEFAULT_SELECT_VALUE
    });
  }

  handleFieldChange(field, value) {
    const { journeyPattern, onChange } = this.props;
    onChange(journeyPattern.withChanges({ [field]: value }));
  }

  handleDirectionSelectionChange(directionSelection) {
    this.handleFieldChange(
      'directionType',
      directionSelection !== DEFAULT_SELECT_VALUE
        ? directionSelection
        : undefined
    );
    this.setState({ directionSelection });
  }

  render() {
    const { journeyPattern, isEditMode, onSave } = this.props;
    const { directionSelection, activeTab } = this.state;

    return (
      <div className="journey-pattern-editor">
        <div className="header">
          <h2>{isEditMode ? 'Rediger' : 'Opprett'} Journey Pattern</h2>

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
          <Tab value={TABS.GENERAL} label="Generelt" className="general-tab">
            <Label>* Navn</Label>
            <TextField
              type="text"
              value={journeyPattern.name}
              onChange={e => this.handleFieldChange('name', e.target.value)}
            />

            <Label>Beskrivelse</Label>
            <TextArea
              type="text"
              value={journeyPattern.description}
              onChange={e =>
                this.handleFieldChange('description', e.target.value)
              }
            />

            <Label>Privat kode</Label>
            <TextField
              type="text"
              value={journeyPattern.privateCode}
              onChange={e =>
                this.handleFieldChange('privateCode', e.target.value)
              }
            />

            <Label>Retning</Label>
            <DropDown
              value={directionSelection}
              onChange={e =>
                this.handleDirectionSelectionChange(e.target.value)
              }
            >
              <DropDownOptions
                label={DEFAULT_SELECT_LABEL}
                value={DEFAULT_SELECT_VALUE}
              />
              {Object.values(DIRECTION_TYPE).map(dt => (
                <DropDownOptions key={dt} label={dt} value={dt} />
              ))}
            </DropDown>
          </Tab>

          <Tab value={TABS.STOP_POINTS} label="Stoppepunkter">
            <StopPointsEditor
              stopPoints={journeyPattern.pointsInSequence}
              onChange={pis => this.handleFieldChange('pointsInSequence', pis)}
            />
          </Tab>

          <Tab value={TABS.SERVICE_JOURNEYS} label="Service Journeys">
            <ServiceJourneysEditor
              serviceJourneys={journeyPattern.serviceJourneys}
              stopPoints={journeyPattern.pointsInSequence}
              onChange={sjs => this.handleFieldChange('serviceJourneys', sjs)}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

JourneyPatternEditor.defaultProps = {
  journeyPattern: PropTypes.instanceOf(JourneyPattern).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool
};

export default JourneyPatternEditor;
