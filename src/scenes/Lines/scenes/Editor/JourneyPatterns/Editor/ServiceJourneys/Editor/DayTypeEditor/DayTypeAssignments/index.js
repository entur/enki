import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { DayTypeAssignment } from 'model';
import DayTypeAssignmentEditor from './Editor';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import messages from '../../../../messages';

import './styles.scss';

const DayTypeAssignmentsEditor = ({ dayTypeAssignments, onChange }) => {
  const { formatMessage } = useSelector(selectIntl);

  const updateDayTypeAssignment = (index, dayTypeAssignment) => {
    onChange(replaceElement(dayTypeAssignments, index, dayTypeAssignment));
  };

  const addNewDayTypeAssignment = () => {
    const today = moment().format('YYYY-MM-DD');
    onChange(
      dayTypeAssignments.concat(
        new DayTypeAssignment({
          operatingPeriod: {
            fromDate: today,
            toDate: today
          }
        })
      )
    );
  };

  const deleteDayTypeAssignment = index => {
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
          {' '}
          {formatMessage(messages.noDayTypeAssignments)}{' '}
        </div>
      )}
    </div>
  );
};

DayTypeAssignmentsEditor.propTypes = {
  dayTypeAssignments: PropTypes.arrayOf(PropTypes.instanceOf(DayTypeAssignment))
    .isRequired,
  onChange: PropTypes.func.isRequired
};

export default DayTypeAssignmentsEditor;
