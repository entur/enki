import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Label,
  TextField,
  TextArea,
  Tabs,
  Tab
} from '@entur/component-library';

import { DayType } from '../../../../../../../../../../../../model';
import DayTypeAssignmentsEditor from './components/DayTypeAssignmentsEditor';
import WeekdayPicker from '../../../../../../../../../../../../components/WeekdayPicker';
import { DAY_OF_WEEK } from '../../../../../../../../../../../../model/enums';

import './styles.css';

const TABS = Object.freeze({
  GENERAL: 'general',
  TIMES: 'times'
});

const daysOfWeekToBoolArray = dows => [
  dows.includes(DAY_OF_WEEK.MONDAY),
  dows.includes(DAY_OF_WEEK.TUESDAY),
  dows.includes(DAY_OF_WEEK.WEDNESDAY),
  dows.includes(DAY_OF_WEEK.THURSDAY),
  dows.includes(DAY_OF_WEEK.FRIDAY),
  dows.includes(DAY_OF_WEEK.SATURDAY),
  dows.includes(DAY_OF_WEEK.SUNDAY)
];

const boolArrayToDaysOfWeek = arr =>
  arr
    .map((bool, i) => ({ dow: Object.values(DAY_OF_WEEK)[i], bool }))
    .filter(obj => obj.bool)
    .map(obj => obj.dow);

class DayTypeEditor extends Component {
  state = { activeTab: TABS.GENERAL };

  handleFieldChange(field, value) {
    const { dayType, onChange } = this.props;
    onChange(dayType.withChanges({ [field]: value }));
  }

  render() {
    const {
      dayType: {
        name,
        description,
        privateCode,
        daysOfWeek,
        dayTypeAssignments
      },
      onSave,
      isEditMode
    } = this.props;
    const { activeTab } = this.state;

    return (
      <div className="day-type-editor">
        <div className="header">
          <h2>{isEditMode ? 'Rediger' : 'Opprett'} Dagstype</h2>

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
          </Tab>

          <Tab value={TABS.TIMES} label="Tidspunkter">
            <Label>Ukedager</Label>
            <WeekdayPicker
              days={daysOfWeekToBoolArray(daysOfWeek)}
              onDaysChange={arr =>
                this.handleFieldChange('daysOfWeek', boolArrayToDaysOfWeek(arr))
              }
            />

            <DayTypeAssignmentsEditor
              dayTypeAssignments={dayTypeAssignments}
              onChange={dtas =>
                this.handleFieldChange('dayTypeAssignments', dtas)
              }
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

DayTypeEditor.propTypes = {
  dayType: PropTypes.instanceOf(DayType).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool
};

export default DayTypeEditor;
