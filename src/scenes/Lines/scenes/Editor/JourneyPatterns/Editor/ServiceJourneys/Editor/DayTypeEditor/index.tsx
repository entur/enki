import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Label } from '@entur/typography';
import { DayType } from 'model';
import DayTypeAssignmentsEditor from './DayTypeAssignments';
import WeekdayPicker from 'components/WeekdayPicker';
import { DAY_OF_WEEK } from 'model/enums';
import './styles.scss';
import messages from '../../../messages';
import DayTypeAssignment from '../../../../../../../../../model/DayTypeAssignment';

type Props = {
  dayType?: DayType;
  onChange: (dayType: DayType) => void;
};

export const daysOfWeekToBoolArray = (dows: DAY_OF_WEEK[]) => [
  dows.includes(DAY_OF_WEEK.MONDAY),
  dows.includes(DAY_OF_WEEK.TUESDAY),
  dows.includes(DAY_OF_WEEK.WEDNESDAY),
  dows.includes(DAY_OF_WEEK.THURSDAY),
  dows.includes(DAY_OF_WEEK.FRIDAY),
  dows.includes(DAY_OF_WEEK.SATURDAY),
  dows.includes(DAY_OF_WEEK.SUNDAY)
];

export const boolArrayToDaysOfWeek = (arr: boolean[]) =>
  arr
    .map((bool, i) => ({ dow: Object.values(DAY_OF_WEEK)[i], bool }))
    .filter(obj => obj.bool)
    .map(obj => obj.dow);

const DayTypeEditor = ({ dayType, onChange }: Props) => {
  const { daysOfWeek = [], dayTypeAssignments = [] } = dayType || {};
  const { formatMessage } = useSelector(selectIntl);

  const onFieldChange = (
    field: string,
    value: (DAY_OF_WEEK | DayTypeAssignment)[]
  ) => {
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
        onDaysChange={arr => {
          onFieldChange('daysOfWeek', boolArrayToDaysOfWeek(arr));
        }}
      />
      <Label>{formatMessage(messages.dates)}</Label>
      <DayTypeAssignmentsEditor
        dayTypeAssignments={dayTypeAssignments}
        onChange={dayTypeAssignments =>
          onFieldChange('dayTypeAssignments', dayTypeAssignments)
        }
      />
    </div>
  );
};

export default DayTypeEditor;
