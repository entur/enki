import { SmallAlertBox } from '@entur/alert';
import { TextField } from '@entur/form';
import { QuestionIcon } from '@entur/icons';
import { Tooltip } from '@entur/tooltip';
import { Heading4 } from '@entur/typography';
import DayTypeAssignmentsEditor from 'components/DayTypesEditor/DayTypeAssignmentsEditor';
import WeekdayPicker from 'components/WeekdayPicker';
import { validateDayType } from 'helpers/validation';
import DayType from 'model/DayType';
import { newDayTypeAssignment } from 'model/DayTypeAssignment';
import React, { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';

type Props = {
  dayType: DayType;
  onChange: (dayType: DayType) => void;
  onValidationChange: (isValid: boolean) => void;
};

export const DayTypeForm = ({
  dayType,
  onChange,
  onValidationChange,
}: Props) => {
  const { formatMessage } = useIntl();

  const hasWeekdays = dayType.daysOfWeek && dayType.daysOfWeek.length > 0;
  const hasAssignments =
    dayType.dayTypeAssignments && dayType.dayTypeAssignments.length > 0;

  const isValid = useMemo(() => {
    // Must have at least one weekday and one assignment to be valid
    if (!hasWeekdays || !hasAssignments) {
      return false;
    }
    return validateDayType(dayType);
  }, [dayType, hasWeekdays, hasAssignments]);

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  return (
    <div className="day-type-form-fields">
      <TextField
        label={formatMessage({ id: 'dayTypeEditorNameFieldLabel' })}
        labelTooltip={formatMessage({
          id: 'dayTypeEditorNameFieldLabelTooltip',
        })}
        className="form-section"
        value={dayType.name || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({
            ...dayType,
            name: e.target.value,
          })
        }
      />

      <Heading4>{formatMessage({ id: 'dayTypeEditorWeekdays' })}</Heading4>
      <WeekdayPicker
        days={dayType.daysOfWeek ?? []}
        onChange={(daysOfWeek) => {
          onChange({
            ...dayType,
            daysOfWeek,
          });
        }}
        spoilPristine={false}
      />

      <Heading4>
        {formatMessage({ id: 'dayTypeEditorDateAvailability' })}
        <Tooltip
          content={formatMessage({ id: 'dayTypeEditorDateTooltip' })}
          placement="right"
        >
          <span className="question-icon">
            <QuestionIcon />
          </span>
        </Tooltip>
      </Heading4>

      <DayTypeAssignmentsEditor
        dayTypeAssignments={
          hasAssignments ? dayType.dayTypeAssignments : [newDayTypeAssignment()]
        }
        onChange={(dayTypeAssignments) => {
          onChange({
            ...dayType,
            dayTypeAssignments,
          });
        }}
      />

      {!isValid && hasWeekdays && hasAssignments && (
        <SmallAlertBox variant="error">
          {formatMessage({ id: 'dayTypesValidationError' })}
        </SmallAlertBox>
      )}
    </div>
  );
};
