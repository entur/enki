import { useMutation } from '@apollo/client/react';
import {
  Alert,
  Button,
  ButtonGroup,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Save from '@mui/icons-material/Save';
import Delete from '@mui/icons-material/Delete';
import HelpOutline from '@mui/icons-material/HelpOutline';
import { DELETE_DAY_TYPE, MUTATE_DAY_TYPE } from 'api/uttu/mutations';
import WeekdayPicker from 'components/WeekdayPicker';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateDayType } from 'validation';
import usePristine from 'hooks/usePristine';
import DayType, { dayTypeToPayload } from 'model/DayType';
import { newDayTypeAssignment } from 'model/DayTypeAssignment';
import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import DayTypeAssignmentsEditor from './DayTypeAssignmentsEditor';

export const DayTypeEditor = ({
  dayType,
  canDelete,
  refetchDayTypes,
}: {
  dayType: DayType;
  canDelete: boolean;
  refetchDayTypes: Function;
}) => {
  const { formatMessage } = useIntl();
  const [mutableDayType, setMutableDayType] = useState(dayType);
  const [mutateDayType] = useMutation(MUTATE_DAY_TYPE, {
    onCompleted: () => refetchDayTypes(),
  });
  const [deleteDayType] = useMutation(DELETE_DAY_TYPE, {
    onCompleted: () => refetchDayTypes(),
  });

  const dayTypeIsValid = useMemo(() => {
    return validateDayType(mutableDayType);
  }, [mutableDayType]);

  const validationMessage = useMemo(() => {
    return formatMessage({ id: 'dayTypesValidationError' });
  }, [formatMessage]);
  const dayTypesPristine = usePristine(mutableDayType, false);
  const dayTypesFeedback = useMemo(
    () => getErrorFeedback(validationMessage, dayTypeIsValid, dayTypesPristine),
    [dayTypesPristine, validationMessage, dayTypeIsValid],
  );

  return (
    <div style={{ padding: '1.5rem' }}>
      <Tooltip
        title={formatMessage({
          id: 'dayTypeEditorNameFieldLabelTooltip',
        })}
        placement="top"
      >
        <TextField
          label={formatMessage({ id: 'dayTypeEditorNameFieldLabel' })}
          className="form-section"
          value={mutableDayType.name || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMutableDayType({
              ...mutableDayType,
              name: e.target.value,
            })
          }
        />
      </Tooltip>
      <Typography variant="h4">
        {formatMessage({ id: 'dayTypeEditorWeekdays' })}
      </Typography>
      <WeekdayPicker
        days={mutableDayType.daysOfWeek ?? []}
        onChange={(daysOfWeek) => {
          setMutableDayType({
            ...mutableDayType,
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
          <span className="question-icon">
            <HelpOutline />
          </span>
        </Tooltip>
      </Typography>
      <ButtonGroup>
        <DayTypeAssignmentsEditor
          dayTypeAssignments={
            mutableDayType.dayTypeAssignments?.length
              ? mutableDayType.dayTypeAssignments
              : [newDayTypeAssignment()]
          }
          onChange={(dayTypeAssignments) => {
            setMutableDayType({
              ...mutableDayType,
              dayTypeAssignments,
            });
          }}
        />

        <Button
          variant="text"
          disabled={!dayTypeIsValid}
          onClick={() => {
            mutateDayType({
              variables: { input: dayTypeToPayload(mutableDayType) },
            });
          }}
          startIcon={<Save />}
        >
          Save
        </Button>
        {dayType.id && (
          <Button
            variant="text"
            disabled={!canDelete}
            onClick={() => {
              deleteDayType({ variables: { id: dayType.id } });
            }}
            startIcon={<Delete />}
          >
            Delete
          </Button>
        )}
      </ButtonGroup>
      {dayTypesFeedback?.feedback && (
        <Alert severity="error">{dayTypesFeedback.feedback}</Alert>
      )}
    </div>
  );
};
