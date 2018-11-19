import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AddIcon } from '@entur/component-library';

import { DayTypeAssignment } from '../../../../../../../../../../model';
import DayTypeAssignmentEditor from './Editor';
import {
  removeElementByIndex,
  replaceElement
} from '../../../../../../../../../../helpers/arrays';
import IconButton from '../../../../../../../../../../components/IconButton';

import './styles.css';

class DayTypeAssignmentsEditor extends Component {
  updateDayTypeAssignment(index, dayTypeAssignment) {
    const { dayTypeAssignments, onChange } = this.props;
    onChange(replaceElement(dayTypeAssignments, index, dayTypeAssignment));
  }

  addNewDayTypeAssignment() {
    const { dayTypeAssignments, onChange } = this.props;
    onChange(dayTypeAssignments.concat(new DayTypeAssignment()));
  }

  deleteDayTypeAssignment(index) {
    const { dayTypeAssignments, onChange } = this.props;
    onChange(removeElementByIndex(dayTypeAssignments, index));
  }

  render() {
    const { dayTypeAssignments } = this.props;

    return (
      <div className="day-type-assignments-editor">
        <IconButton
          icon={<AddIcon />}
          label="Legg til dato"
          labelPosition="right"
          onClick={::this.addNewDayTypeAssignment}
        />

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
