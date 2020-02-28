import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import moment from 'moment/moment';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { DayTypeAssignment } from 'model';
import DayTypeAssignmentEditor from './Editor';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import messages from '../../../../messages';

import './styles.scss';

type Props = {
  dayTypeAssignments: DayTypeAssignment[];
  onChange: (dayTypeAssignment: DayTypeAssignment[]) => void;
};

const DayTypeAssignmentsEditor = ({ dayTypeAssignments, onChange }: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const updateDayTypeAssignment = (
    index: number,
    dayTypeAssignment: DayTypeAssignment
  ) => {
    onChange(replaceElement(dayTypeAssignments, index, dayTypeAssignment));
  };

  const addNewDayTypeAssignment = () => {
    const today = moment().format('YYYY-MM-DD');
    const dayTypeAssignment = {
      isAvailable: false,
      operatingPeriod: {
        fromDate: today,
        toDate: today
      }
    };
    onChange(dayTypeAssignments.concat(dayTypeAssignment));
  };

  const deleteDayTypeAssignment = (index: number) => {
    onChange(removeElementByIndex(dayTypeAssignments, index));
  };

  return (
    <div className="day-type-assignments-editor">
      <SecondaryButton onClick={() => addNewDayTypeAssignment()}>
        <AddIcon />
        {formatMessage(messages.addDayTypeAssignment)}
      </SecondaryButton>

      {dayTypeAssignments.length > 0 ? (
        dayTypeAssignments.map((dta, i) => (
          <DayTypeAssignmentEditor
            key={Math.random()}
            dayTypeAssignment={dta}
            onChange={dta => updateDayTypeAssignment(i, dta)}
            onDelete={() => deleteDayTypeAssignment(i)}
          />
        ))
      ) : (
        <div className="no-day-types">
          {formatMessage(messages.noDayTypeAssignments)}
        </div>
      )}
    </div>
  );
};

export default DayTypeAssignmentsEditor;
