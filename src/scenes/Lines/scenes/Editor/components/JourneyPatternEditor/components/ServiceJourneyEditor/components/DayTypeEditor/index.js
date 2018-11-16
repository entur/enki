import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@entur/component-library';

import { DayType } from '../../../../../../../../../../model';
import DayTypeAssignmentsEditor from './components/DayTypeAssignmentsEditor';
import WeekdayPicker from '../../../../../../../../../../components/WeekdayPicker';
import { DAY_OF_WEEK } from '../../../../../../../../../../model/enums';

import './styles.css';

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
  handleFieldChange(field, value) {
    const { dayType, onChange } = this.props;

    const newDayType = dayType
      ? dayType.withChanges({ [field]: value })
      : new DayType({ [field]: value });

    onChange(newDayType.isEmpty() ? undefined : newDayType);
  }

  render() {
    const { dayType } = this.props;

    const daysOfWeek = dayType ? dayType.daysOfWeek : [];
    const dayTypeAssignments = dayType ? dayType.dayTypeAssignments : [];

    return (
      <div className="day-type-editor">
        <Label>Ukedager</Label>
        <WeekdayPicker
          days={daysOfWeekToBoolArray(daysOfWeek)}
          onDaysChange={arr =>
            this.handleFieldChange('daysOfWeek', boolArrayToDaysOfWeek(arr))
          }
        />

        <Label>Datoer</Label>
        <DayTypeAssignmentsEditor
          dayTypeAssignments={dayTypeAssignments}
          onChange={dtas => this.handleFieldChange('dayTypeAssignments', dtas)}
        />
      </div>
    );
  }
}

DayTypeEditor.propTypes = {
  dayType: PropTypes.instanceOf(DayType).isRequired,
  onChange: PropTypes.func.isRequired
};

export default DayTypeEditor;
