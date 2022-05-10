import { useMutation } from '@apollo/client';
import { ButtonGroup, TertiaryButton } from '@entur/button';
import { TextField } from '@entur/form';
import { DeleteIcon, QuestionIcon, SaveIcon } from '@entur/icons';
import { Tooltip } from '@entur/tooltip';
import { Heading4 } from '@entur/typography';
import { DELETE_DAY_TYPE, MUTATE_DAY_TYPE } from 'api/uttu/mutations';
import { GET_DAY_TYPES } from 'api/uttu/queries';
import DayTypeAssignmentsEditor from './DayTypeAssignmentsEditor';
import WeekdayPicker from 'components/WeekdayPicker';
import { selectIntl } from 'i18n';
import DayType from 'model/DayType';
import { newDayTypeAssignment } from 'model/DayTypeAssignment';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export const DayTypeEditor = ({
  dayType,
  onSave,
}: {
  dayType: DayType;
  onSave: Function;
}) => {
  const { formatMessage } = useSelector(selectIntl);
  const [mutableDayType, setMutableDayType] = useState(dayType);
  const [mutateDayType] = useMutation(MUTATE_DAY_TYPE, {
    update: (cache, { data }) => {
      const { dayTypes } = cache.readQuery({ query: GET_DAY_TYPES }) as {
        dayTypes: DayType[];
      };
      cache.writeQuery({
        query: GET_DAY_TYPES,
        data: { dayTypes: [data, ...dayTypes] },
      });
    },
  });
  const [deleteDayType] = useMutation(DELETE_DAY_TYPE, {
    update: (cache) => {
      const { dayTypes } = cache.readQuery({ query: GET_DAY_TYPES }) as {
        dayTypes: DayType[];
      };
      cache.writeQuery({
        query: GET_DAY_TYPES,
        data: {
          dayTypes: dayTypes.filter((dt: DayType) => dt.id !== dayType.id),
        },
      });
    },
  });

  /*
    const dayTypesPristine = usePristine(dayTypes, spoilPristine);

    const dayTypesFeedback = getErrorFeedback(
      formatMessage('dayTypesValidationError'),
      validateDayTypes(dayTypes),
      dayTypesPristine
    );
    */

  return (
    <div style={{ padding: '1.5rem' }}>
      <TextField
        label="Name"
        labelTooltip="To help identify the day type entity within Nplan"
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
          onClick={() => {
            onSave();
            mutateDayType({ variables: { input: mutableDayType } });
          }}
        >
          <SaveIcon /> Save
        </TertiaryButton>
        <TertiaryButton
          onClick={() => {
            onSave();
            deleteDayType({ variables: { id: dayType.id } });
          }}
        >
          <DeleteIcon /> Delete
        </TertiaryButton>
      </ButtonGroup>
    </div>
  );
};
