import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@entur/typography';

import { DayType } from 'model';
import DayTypeAssignmentsEditor from './DayTypeAssignments';
import WeekdayPicker from 'components/WeekdayPicker';
import { DAY_OF_WEEK } from 'model/enums';

import './styles.scss';

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
  onFieldChange(field, value) {
    const { dayType, onChange } = this.props;

    const newDayType = dayType
      ? dayType.withFieldChange(field, value)
      : new DayType({ [field]: value });

    onChange(newDayType.isEmpty() ? undefined : newDayType);
  }

  render() {
    const { dayType = {} } = this.props;
    const { daysOfWeek = [], dayTypeAssignments = [] } = dayType;

    return (
      <div className="day-type-editor">
        <Label>Ukedager</Label>
        <WeekdayPicker
          days={daysOfWeekToBoolArray(daysOfWeek)}
          onDaysChange={arr =>
            this.onFieldChange('daysOfWeek', boolArrayToDaysOfWeek(arr))
          }
        />
        <Label>Datoer</Label>
        <DayTypeAssignmentsEditor
          dayTypeAssignments={dayTypeAssignments}
          onChange={dtas => this.onFieldChange('dayTypeAssignments', dtas)}
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
