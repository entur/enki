import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Heading4, Label } from '@entur/typography';
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

  return (
    <div className="day-type-editor">
      <Heading4> {formatMessage(messages.weekdaysAvailability)} </Heading4>
      <WeekdayPicker
        days={dayType.daysOfWeek}
        onDaysChange={(daysOfWeek) => {
          const updatedDayType: DayType = {
            ...dayType,
            daysOfWeek,
          };
          onChange(dayTypeIsEmpty(updatedDayType) ? undefined : updatedDayType);
        }}
        spoilPristine
      />
      <section className="day-type-assignments">
        <Heading4>{formatMessage(messages.dateAvailability)}</Heading4>
        <DayTypeAssignmentsEditor
          dayTypeAssignments={dayType.dayTypeAssignments}
          onChange={(dayTypeAssignments) => {
            const updatedDayType: DayType = {
              ...dayType,
              dayTypeAssignments,
            };
            onChange(
              dayTypeIsEmpty(updatedDayType) ? undefined : updatedDayType
            );
          }}
        />
      </section>
    </div>
  );
};

export default DayTypeEditor;
