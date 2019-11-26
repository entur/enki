import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Tabs, Tab } from '@entur/component-library';

import { JourneyPattern } from 'model';
import StopPointsEditor from './StopPoints';
import ServiceJourneysEditor from './ServiceJourneys';

import './styles.css';
import General from './General';

import { DEFAULT_SELECT_VALUE } from '../../constants';

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

  onFieldChange(field, value) {
    const { journeyPattern, onChange } = this.props;
    onChange(journeyPattern.withFieldChange(field, value));
  }

  handleDirectionSelectionChange(directionSelection) {
    this.onFieldChange(
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
            <General
              journeyPattern={journeyPattern}
              directionSelection={directionSelection}
              onFieldChange={this.onFieldChange.bind(this)}
              handleDirectionSelectionChange={this.handleDirectionSelectionChange.bind(
                this
              )}
            />
          </Tab>

          <Tab value={TABS.STOP_POINTS} label="Stoppepunkter">
            <StopPointsEditor
              stopPoints={journeyPattern.pointsInSequence}
              onChange={pis => this.onFieldChange('pointsInSequence', pis)}
            />
          </Tab>

          <Tab value={TABS.SERVICE_JOURNEYS} label="Service Journeys">
            <ServiceJourneysEditor
              serviceJourneys={journeyPattern.serviceJourneys}
              stopPoints={journeyPattern.pointsInSequence}
              onChange={sjs => this.onFieldChange('serviceJourneys', sjs)}
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
