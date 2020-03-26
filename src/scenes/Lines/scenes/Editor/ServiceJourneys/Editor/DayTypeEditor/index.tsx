import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Label } from '@entur/typography';
import DayTypeAssignmentsEditor from './DayTypeAssignments';
import WeekdayPicker from 'components/WeekdayPicker';
import './styles.scss';
import messages from '../../messages';
import DayType, { dayTypeIsEmpty } from 'model/DayType';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';

type Props = {
  dayType: DayType;
  onChange: (dayType: DayType | undefined) => void;
  spoilPristine: boolean;
};

const DayTypeEditor = ({ dayType, onChange, spoilPristine }: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const weekdayPristine = usePristine(dayType.daysOfWeek, spoilPristine);

  return (
    <div className="day-type-editor">
      <Label> {formatMessage(messages.weekdays)} </Label>
      <WeekdayPicker
        days={dayType.daysOfWeek}
        onDaysChange={(daysOfWeek) => {
          const updatedDayType: DayType = {
            ...dayType,
            daysOfWeek,
          };
          onChange(dayTypeIsEmpty(updatedDayType) ? undefined : updatedDayType);
        }}
        feedbackMessage={
          getErrorFeedback(
            formatMessage(messages.availabilityMustBeFilled),
            dayType.daysOfWeek.length !== 0,
            weekdayPristine
          ).feedback
        }
      />
      <Label>{formatMessage(messages.dates)}</Label>
      <DayTypeAssignmentsEditor
        dayTypeAssignments={dayType.dayTypeAssignments}
        onChange={(dayTypeAssignments) => {
          const updatedDayType: DayType = {
            ...dayType,
            dayTypeAssignments,
          };
          onChange(dayTypeIsEmpty(updatedDayType) ? undefined : updatedDayType);
        }}
      />
    </div>
  );
};

export default DayTypeEditor;
