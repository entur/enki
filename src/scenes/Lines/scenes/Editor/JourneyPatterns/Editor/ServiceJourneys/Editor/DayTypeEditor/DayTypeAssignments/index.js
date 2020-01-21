import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { DayTypeAssignment } from 'model';
import DayTypeAssignmentEditor from './Editor';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';

import './styles.scss';

class DayTypeAssignmentsEditor extends Component {
  updateDayTypeAssignment(index, dayTypeAssignment) {
    const { dayTypeAssignments, onChange } = this.props;
    onChange(replaceElement(dayTypeAssignments, index, dayTypeAssignment));
  }

  addNewDayTypeAssignment() {
    const { dayTypeAssignments, onChange } = this.props;
    const today = moment().format('YYYY-MM-DD');
    onChange(
      dayTypeAssignments.concat(
        new DayTypeAssignment({
          fromDate: today,
          toDate: today
        })
      )
    );
  }

  deleteDayTypeAssignment(index) {
    const { dayTypeAssignments, onChange } = this.props;
    onChange(removeElementByIndex(dayTypeAssignments, index));
  }

  render() {
    const { dayTypeAssignments } = this.props;

    return (
      <div className="day-type-assignments-editor">
        <SecondaryButton onClick={() => this.addNewDayTypeAssignment()}>
          <AddIcon />
          Legg til dato
        </SecondaryButton>

        {dayTypeAssignments.length > 0 ? (
          dayTypeAssignments.map((dta, i) => (
            <DayTypeAssignmentEditor
              key={i}
              dayTypeAssignment={dta}
              onChange={dta => this.updateDayTypeAssignment(i, dta)}
              onDelete={() => this.deleteDayTypeAssignment(i)}
            />
          ))
        ) : (
          <div className="no-day-types">Ingen datoer er definert.</div>
        )}
      </div>
    );
  }
}

DayTypeAssignmentsEditor.propTypes = {
  dayTypeAssignments: PropTypes.arrayOf(PropTypes.instanceOf(DayTypeAssignment))
    .isRequired,
  onChange: PropTypes.func.isRequired
};

export default DayTypeAssignmentsEditor;
