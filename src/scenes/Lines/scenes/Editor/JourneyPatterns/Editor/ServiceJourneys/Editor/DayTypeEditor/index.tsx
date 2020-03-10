import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Label } from '@entur/typography';
import DayTypeAssignmentsEditor from './DayTypeAssignments';
import WeekdayPicker from 'components/WeekdayPicker';
import './styles.scss';
import messages from '../../../messages';
import DayType, { dayTypeIsEmpty } from 'model/DayType';

type Props = {
  dayType: DayType;
  onChange: (dayType: DayType | undefined) => void;
};

const DayTypeEditor = ({ dayType, onChange }: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <div className="day-type-editor">
      <Label> {formatMessage(messages.weekdays)} </Label>
      <WeekdayPicker
        days={dayType.daysOfWeek}
        onDaysChange={daysOfWeek => {
          const updatedDayType: DayType = {
            ...dayType,
            daysOfWeek
          };
          onChange(dayTypeIsEmpty(updatedDayType) ? undefined : updatedDayType);
        }}
        feedbackMessage={formatMessage(messages.availabilityMustBeFilled)}
      />
      <Label>{formatMessage(messages.dates)}</Label>
      <DayTypeAssignmentsEditor
        dayTypeAssignments={dayType.dayTypeAssignments}
        onChange={dayTypeAssignments => {
          const updatedDayType: DayType = {
            ...dayType,
            dayTypeAssignments
          };
          onChange(dayTypeIsEmpty(updatedDayType) ? undefined : updatedDayType);
        }}
      />
    </div>
  );
};

export default DayTypeEditor;
