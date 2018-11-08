import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions,
  Expandable,
  ExpandableHeader,
  ExpandableContent
} from '@entur/component-library';

import {
  ServiceJourney,
  StopPointInJourneyPattern
} from '../../../../../../../../model';
import BookingArrangementEditor from '../../../BookingArrangementEditor';
import TimetabledPassingTimesEditor from './components/TimetabledPassingTimesEditor';
import { ORGANISATION_TYPE } from '../../../../../../../../model/enums';

import './styles.css';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

class ServiceJourneyEditor extends Component {
  state = { operatorSelection: DEFAULT_SELECT_VALUE };

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
        passingTimes
      },
      stopPoints
    } = this.props;
    const { operatorSelection } = this.state;

    const operators = organisations.filter(org =>
      org.types.includes(ORGANISATION_TYPE.OPERATOR)
    );

    return (
      <div className="service-journey-editor">
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
          onChange={e => this.handleFieldChange('description', e.target.value)}
        />

        <Label>Privat kode</Label>
        <TextField
          type="text"
          value={privateCode}
          onChange={e => this.handleFieldChange('privateCode', e.target.value)}
        />

        <Label>Offentlig kode</Label>
        <TextField
          type="text"
          value={publicCode}
          onChange={e => this.handleFieldChange('publicCode', e.target.value)}
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

        <Expandable>
          <ExpandableHeader>Bestillingsinformasjon</ExpandableHeader>
          <ExpandableContent>
            <BookingArrangementEditor
              bookingArrangement={bookingArrangement}
              onChange={b => this.handleFieldChange('bookingArrangement', b)}
            />
          </ExpandableContent>
        </Expandable>

        <Label>Passeringstider</Label>
        <TimetabledPassingTimesEditor
          timetabledPassingTimes={passingTimes}
          stopPoints={stopPoints}
          onChange={pts => this.handleFieldChange('passingTimes', pts)}
        />
      </div>
    );
  }
}

ServiceJourneyEditor.propTypes = {
  serviceJourney: PropTypes.instanceOf(ServiceJourney).isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPointInJourneyPattern))
    .isRequired,
  onChange: PropTypes.func.isRequired
};

const mapStateToProps = ({ organisations }) => ({ organisations });

export default connect(mapStateToProps)(ServiceJourneyEditor);
