import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import PropTypes from 'prop-types';
import { Label } from '@entur/typography';
import { DayType } from 'model';
import DayTypeAssignmentsEditor from './DayTypeAssignments';
import WeekdayPicker from 'components/WeekdayPicker';
import { DAY_OF_WEEK } from 'model/enums';
import './styles.scss';
import messages from '../../../messages';

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

const DayTypeEditor = ({ dayType, onChange }) => {
  const { daysOfWeek = [], dayTypeAssignments = [] } = dayType || {};
  const { formatMessage } = useSelector(selectIntl);

  const onFieldChange = (field, value) => {
    const newDayType = dayType
      ? dayType.withFieldChange(field, value)
      : new DayType({ [field]: value });

    onChange(newDayType.isEmpty() ? undefined : newDayType);
  };

  return (
    <div className="day-type-editor">
      <Label> {formatMessage(messages.weekdays)} </Label>
      <WeekdayPicker
        days={daysOfWeekToBoolArray(daysOfWeek)}
        onDaysChange={arr =>
          onFieldChange('daysOfWeek', boolArrayToDaysOfWeek(arr))
        }
      />
      <Label> {formatMessage(messages.dates)} </Label>
      <DayTypeAssignmentsEditor
        dayTypeAssignments={dayTypeAssignments}
        onChange={dtas => onFieldChange('dayTypeAssignments', dtas)}
      />
    </div>
  );
};

DayTypeEditor.propTypes = {
  dayType: PropTypes.instanceOf(DayType).isRequired,
  onChange: PropTypes.func.isRequired
};

export default DayTypeEditor;
