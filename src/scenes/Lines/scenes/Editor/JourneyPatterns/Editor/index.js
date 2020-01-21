import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@entur/component-library';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@entur/tab';

import { JourneyPattern } from 'model';
import StopPointsEditor from './StopPoints';
import ServiceJourneysEditor from './ServiceJourneys';

import './styles.scss';
import General from './General';

import { DEFAULT_SELECT_VALUE } from '../../constants';

class JourneyPatternEditor extends Component {
  state = {
    stopPlaceSelection: DEFAULT_SELECT_VALUE,
    directionSelection: DEFAULT_SELECT_VALUE
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
    const { directionSelection } = this.state;

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
        <Tabs>
          <TabList>
            <Tab>Generelt</Tab>
            <Tab>Stoppepunkter</Tab>
            <Tab>Service Journeys</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <General
                journeyPattern={journeyPattern}
                directionSelection={directionSelection}
                onFieldChange={this.onFieldChange.bind(this)}
                handleDirectionSelectionChange={this.handleDirectionSelectionChange.bind(
                  this
                )}
              />
            </TabPanel>
            <TabPanel>
              <StopPointsEditor
                stopPoints={journeyPattern.pointsInSequence}
                onChange={pis => this.onFieldChange('pointsInSequence', pis)}
              />
            </TabPanel>
            <TabPanel>
              <ServiceJourneysEditor
                serviceJourneys={journeyPattern.serviceJourneys}
                stopPoints={journeyPattern.pointsInSequence}
                onChange={sjs => this.onFieldChange('serviceJourneys', sjs)}
              />
            </TabPanel>
          </TabPanels>
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
