import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions,
  Button,
  Tabs,
  Tab
} from '@entur/component-library';

import { ServiceJourney, StopPoint } from '../../../../../../../../model';
import BookingArrangementEditor from '../../../../BookingArrangementEditor';
import PassingTimesEditor from './PassingTimesEditor';
import DayTypeEditor from './DayTypeEditor';
import { ORGANISATION_TYPE } from '../../../../../../../../model/enums';

import './styles.css';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

const TABS = Object.freeze({
  GENERAL: 'general',
  AVAILABILITY: 'availability',
  PASSING_TIMES: 'passingTimes',
  BOOKING: 'booking'
});

class ServiceJourneyEditor extends Component {
  state = {
    operatorSelection: DEFAULT_SELECT_VALUE,
    activeTab: TABS.GENERAL
  };

  componentDidMount() {
    this.setState({ operatorSelection: this.props.serviceJourney.operatorRef });
  }

  handleFieldChange(field, value, multi = false) {
    const { serviceJourney, onChange } = this.props;

    let newValue = value;
    if (multi) {
      newValue = serviceJourney[field].includes(value)
        ? serviceJourney[field].filter(v => v !== value)
        : serviceJourney[field].concat(value);
    }

    onChange(serviceJourney.withChanges({ [field]: newValue }));
  }

  handleOperatorSelectionChange(operatorSelection) {
    this.handleFieldChange(
      'operatorRef',
      operatorSelection !== DEFAULT_SELECT_VALUE ? operatorSelection : undefined
    );
    this.setState({ operatorSelection });
  }

  render() {
    const {
      organisations,
      serviceJourney: {
        name,
        description,
        privateCode,
        publicCode,
        bookingArrangement,
        passingTimes,
        dayTypes
      },
      stopPoints,
      onSave,
      isEditMode
    } = this.props;
    const { operatorSelection, activeTab } = this.state;

    const operators = organisations.filter(org =>
      org.types.includes(ORGANISATION_TYPE.OPERATOR)
    );

    return (
      <div className="service-journey-editor">
        <div className="header">
          <h2>{isEditMode ? 'Rediger' : 'Opprett'} Service Journey</h2>

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
            <Label>Navn</Label>
            <TextField
              type="text"
              value={name}
              onChange={e => this.handleFieldChange('name', e.target.value)}
            />

            <Label>Beskrivelse</Label>
            <TextArea
              type="text"
              value={description}
              onChange={e =>
                this.handleFieldChange('description', e.target.value)
              }
            />

            <Label>Privat kode</Label>
            <TextField
              type="text"
              value={privateCode}
              onChange={e =>
                this.handleFieldChange('privateCode', e.target.value)
              }
            />

            <Label>Offentlig kode</Label>
            <TextField
              type="text"
              value={publicCode}
              onChange={e =>
                this.handleFieldChange('publicCode', e.target.value)
              }
            />

            <Label>Operatør</Label>
            <DropDown
              value={operatorSelection}
              onChange={e => this.handleOperatorSelectionChange(e.target.value)}
            >
              <DropDownOptions
                label={DEFAULT_SELECT_LABEL}
                value={DEFAULT_SELECT_VALUE}
              />
              {operators.map(o => (
                <DropDownOptions key={o.name} label={o.name} value={o.id} />
              ))}
            </DropDown>
          </Tab>

          <Tab value={TABS.AVAILABILITY} label="Tilgjengelighet">
            <DayTypeEditor
              dayType={dayTypes.length > 0 ? dayTypes[0] : undefined}
              onChange={dt => this.handleFieldChange('dayTypes', [dt])}
            />
          </Tab>

          <Tab value={TABS.PASSING_TIMES} label="Passeringstider">
            <PassingTimesEditor
              passingTimes={passingTimes}
              stopPoints={stopPoints}
              onChange={pts => this.handleFieldChange('passingTimes', pts)}
            />
          </Tab>

          <Tab value={TABS.BOOKING} label="Bestilling" className="booking-tab">
            <BookingArrangementEditor
              bookingArrangement={bookingArrangement}
              onChange={b => this.handleFieldChange('bookingArrangement', b)}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

ServiceJourneyEditor.propTypes = {
  serviceJourney: PropTypes.instanceOf(ServiceJourney).isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool
};

const mapStateToProps = ({ organisations }) => ({ organisations });

export default connect(mapStateToProps)(ServiceJourneyEditor);
