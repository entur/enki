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
        days={daysOfWeek}
        onDaysChange={arr => onFieldChange('daysOfWeek', arr)}
        feedbackMessage={formatMessage(messages.availabilityMustBeFilled)}
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
