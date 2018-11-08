import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions,
  Tabs,
  Tab,
  AddIcon
} from '@entur/component-library';

import {
  DestinationDisplay,
  JourneyPattern,
  ServiceJourney,
  StopPointInJourneyPattern
} from '../../../../../../model';
import ServiceJourneysTable from './components/ServiceJourneysTable';
import Dialog from '../../../../../../components/Dialog';
import ServiceJourneyEditor from './components/ServiceJourneyEditor';
import { DIRECTION_TYPE } from '../../../../../../model/enums';
import IconButton from '../../../../../../components/IconButton';

import './styles.css';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

const TABS = Object.freeze({
  GENERAL: 'general',
  STOP_PLACES: 'stopPlaces',
  SERVICE_JOURNEYS: 'serviceJourneys'
});

class JourneyPatternEditor extends Component {
  state = {
    stopPlaceSelection: DEFAULT_SELECT_VALUE,
    directionSelection: DEFAULT_SELECT_VALUE,
    activeTab: TABS.GENERAL,
    serviceJourneyInDialog: null,
    serviceJourneyIndexInDialog: -1
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

  handleFieldChange(field, value, multi = false) {
    const { journeyPattern, onChange } = this.props;

    let newValue = value;
    if (multi) {
      newValue = journeyPattern[field].includes(value)
        ? journeyPattern[field].filter(v => v !== value)
        : journeyPattern[field].concat(value);
    }

    onChange(journeyPattern.withChanges({ [field]: newValue }));
  }

  handleStopPlaceSelectionChange(stopPlaceSelection) {
    let newPointsInSequence = [];
    if (stopPlaceSelection !== DEFAULT_SELECT_VALUE) {
      const stopPoint = new StopPointInJourneyPattern({
        flexibleStopPlaceRef: stopPlaceSelection,
        destinationDisplay: new DestinationDisplay({ frontText: 'Destination' })
      });
      newPointsInSequence = [stopPoint, stopPoint];
    }
    this.handleFieldChange('pointsInSequence', newPointsInSequence);
    this.setState({ stopPlaceSelection });
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

  addServiceJourney(index, serviceJourney) {
    const { journeyPattern, onChange } = this.props;
    onChange(journeyPattern.addServiceJourney(index, serviceJourney));
  }

  updateServiceJourney(index, serviceJourney) {
    const { journeyPattern, onChange } = this.props;
    onChange(journeyPattern.updateServiceJourney(index, serviceJourney));
  }

  deleteServiceJourney(index) {
    const { journeyPattern, onChange } = this.props;
    onChange(journeyPattern.removeServiceJourney(index));
  }

  updateJourneyPattern(journeyPattern) {
    this.props.onChange(journeyPattern);
  }

  openDialogForServiceJourney(index) {
    this.setState({
      serviceJourneyIndexInDialog: index,
      serviceJourneyInDialog: this.props.journeyPattern.serviceJourneys[index]
    });
  }

  openDialogForNewServiceJourney() {
    this.setState({ serviceJourneyInDialog: new ServiceJourney() });
  }

  closeServiceJourneyDialog() {
    this.setState({
      serviceJourneyInDialog: null,
      serviceJourneyIndexInDialog: -1
    });
  }

  handleOnServiceJourneyDialogSaveClick() {
    const { serviceJourneyInDialog, serviceJourneyIndexInDialog } = this.state;
    if (serviceJourneyIndexInDialog === -1) {
      this.addServiceJourney(serviceJourneyInDialog);
    } else {
      this.updateServiceJourney(
        serviceJourneyIndexInDialog,
        serviceJourneyInDialog
      );
    }
    this.setState({
      serviceJourneyInDialog: null,
      serviceJourneyIndexInDialog: -1
    });
  }

  render() {
    const {
      flexibleStopPlaces,
      journeyPattern,
      isEditMode,
      onSave
    } = this.props;
    const {
      stopPlaceSelection,
      directionSelection,
      activeTab,
      serviceJourneyInDialog,
      serviceJourneyIndexInDialog
    } = this.state;

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
          <Tab value={TABS.GENERAL} label="Generelt">
            <Label>Navn</Label>
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
          </Tab>

          <Tab value={TABS.STOP_PLACES} label="Stoppesteder">
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
          </Tab>

          <Tab value={TABS.SERVICE_JOURNEYS} label="Service Journeys">
            <IconButton
              icon={<AddIcon />}
              label="Legg til service journey"
              labelPosition="right"
              onClick={::this.openDialogForNewServiceJourney}
            />

            <ServiceJourneysTable
              serviceJourneys={journeyPattern.serviceJourneys}
              onRowClick={::this.openDialogForServiceJourney}
              onDeleteClick={::this.deleteServiceJourney}
            />
          </Tab>
        </Tabs>

        {serviceJourneyInDialog !== null && (
          <Dialog
            isOpen={true}
            content={
              <ServiceJourneyEditor
                serviceJourney={serviceJourneyInDialog}
                stopPoints={journeyPattern.pointsInSequence}
                onChange={serviceJourneyInDialog =>
                  this.setState({ serviceJourneyInDialog })
                }
                onSave={::this.handleOnServiceJourneyDialogSaveClick}
                isEditMode={serviceJourneyIndexInDialog !== -1}
              />
            }
            onClose={::this.closeServiceJourneyDialog}
          />
        )}
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

const mapStateToProps = ({ flexibleStopPlaces }) => ({ flexibleStopPlaces });

export default connect(mapStateToProps)(JourneyPatternEditor);
