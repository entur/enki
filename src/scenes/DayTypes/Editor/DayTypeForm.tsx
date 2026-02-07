import HelpOutline from '@mui/icons-material/HelpOutline';
import { Alert, Box, TextField, Tooltip, Typography } from '@mui/material';
import DayTypeAssignmentsEditor from 'components/DayTypesEditor/DayTypeAssignmentsEditor';
import WeekdayPicker from 'components/WeekdayPicker';
import { validateDayType } from 'validation';
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
    if (!hasWeekdays || !hasAssignments) {
      return false;
    }
    return validateDayType(dayType);
  }, [dayType, hasWeekdays, hasAssignments]);

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  return (
    <Box>
      <TextField
        variant="outlined"
        label={formatMessage({ id: 'dayTypeEditorNameFieldLabel' })}
        value={dayType.name || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({
            ...dayType,
            name: e.target.value,
          })
        }
      />

      <Typography variant="h4">
        {formatMessage({ id: 'dayTypeEditorWeekdays' })}
      </Typography>
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

      <Typography variant="h4">
        {formatMessage({ id: 'dayTypeEditorDateAvailability' })}
        <Tooltip
          title={formatMessage({ id: 'dayTypeEditorDateTooltip' })}
          placement="right"
        >
          <span style={{ marginLeft: '0.25rem', cursor: 'help' }}>
            <HelpOutline />
          </span>
        </Tooltip>
      </Typography>

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
        <Alert severity="error">
          {formatMessage({ id: 'dayTypesValidationError' })}
        </Alert>
      )}
    </Box>
  );
};
