import { useMutation } from '@apollo/client';
import { ButtonGroup, TertiaryButton } from '@entur/button';
import { TextField } from '@entur/form';
import { DeleteIcon, QuestionIcon, SaveIcon } from '@entur/icons';
import { Tooltip } from '@entur/tooltip';
import { Heading4 } from '@entur/typography';
import { DELETE_DAY_TYPE, MUTATE_DAY_TYPE } from 'api/uttu/mutations';
import DayTypeAssignmentsEditor from './DayTypeAssignmentsEditor';
import WeekdayPicker from 'components/WeekdayPicker';
import { selectIntl } from 'i18n';
import DayType, { dayTypeToPayload } from 'model/DayType';
import { newDayTypeAssignment } from 'model/DayTypeAssignment';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getErrorFeedback } from 'helpers/errorHandling';
import usePristine from 'hooks/usePristine';
import { validateDayType } from 'helpers/validation';
import { SmallAlertBox } from '@entur/alert';

export const DayTypeEditor = ({
  dayType,
  canDelete,
  refetchDayTypes,
}: {
  dayType: DayType;
  canDelete: boolean;
  refetchDayTypes: Function;
}) => {
  const { formatMessage } = useSelector(selectIntl);
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
    return formatMessage('dayTypesValidationError');
  }, [formatMessage]);
  const dayTypesPristine = usePristine(mutableDayType, false);
  const dayTypesFeedback = useMemo(
    () => getErrorFeedback(validationMessage, dayTypeIsValid, dayTypesPristine),
    [dayTypesPristine, validationMessage, dayTypeIsValid]
  );

  return (
    <div style={{ padding: '1.5rem' }}>
      <TextField
        label={formatMessage('dayTypeEditorNameFieldLabel')}
        labelTooltip={formatMessage('dayTypeEditorNameFieldLabelTooltip')}
        className="form-section"
        value={mutableDayType.name || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMutableDayType({
            ...mutableDayType,
            name: e.target.value,
          })
        }
      />
      <Heading4>{formatMessage('dayTypeEditorWeekdays')}</Heading4>
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
      <Heading4>
        {formatMessage('dayTypeEditorDateAvailability')}
        <Tooltip
          content={formatMessage('dayTypeEditorDateTooltip')}
          placement="right"
        >
          <span className="question-icon">
            <QuestionIcon />
          </span>
        </Tooltip>
      </Heading4>
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

        <TertiaryButton
          disabled={!dayTypeIsValid}
          onClick={() => {
            mutateDayType({
              variables: { input: dayTypeToPayload(mutableDayType) },
            });
          }}
        >
          <SaveIcon /> Save
        </TertiaryButton>
        {dayType.id && (
          <TertiaryButton
            disabled={!canDelete}
            onClick={() => {
              deleteDayType({ variables: { id: dayType.id } });
            }}
          >
            <DeleteIcon /> Delete
          </TertiaryButton>
        )}
      </ButtonGroup>
      {dayTypesFeedback?.feedback && (
        <SmallAlertBox variant="error">
          {dayTypesFeedback.feedback}
        </SmallAlertBox>
      )}
    </div>
  );
};
