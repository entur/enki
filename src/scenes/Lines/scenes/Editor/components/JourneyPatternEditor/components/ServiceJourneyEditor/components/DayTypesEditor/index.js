import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AddIcon } from '@entur/component-library';

import { DayType } from '../../../../../../../../../../model';
import DayTypeEditor from './components/DayTypeEditor';
import { replaceElement } from '../../../../../../../../../../helpers/arrays';
import DayTypesTable from './components/DayTypesTable';
import IconButton from '../../../../../../../../../../components/IconButton';
import Dialog from '../../../../../../../../../../components/Dialog';

class DayTypesEditor extends Component {
  state = {
    dayTypeInDialog: null,
    dayTypeIndexInDialog: -1
  };

  updateDayType(index, dayType) {
    const { dayTypes, onChange } = this.props;
    onChange(replaceElement(dayTypes, index, dayType));
  }

  deleteDayType(index) {
    const { dayTypes, onChange } = this.props;
    const copy = dayTypes.slice();
    copy.splice(index, 1);
    onChange(copy);
  }

  openDialogForNewDayType() {
    this.setState({ dayTypeInDialog: new DayType() });
  }

  openDialogForDayType(index) {
    this.setState({
      dayTypeInDialog: this.props.dayTypes[index],
      dayTypeIndexInDialog: index
    });
  }

  closeDayTypeDialog() {
    this.setState({
      dayTypeInDialog: null,
      dayTypeIndexInDialog: -1
    });
  }

  handleOnDayTypeDialogSaveClick() {
    const { dayTypes, onChange } = this.props;
    const { dayTypeInDialog, dayTypeIndexInDialog } = this.state;
    if (dayTypeIndexInDialog === -1) {
      onChange(dayTypes.concat(dayTypeInDialog));
    } else {
      this.updateDayType(dayTypeIndexInDialog, dayTypeInDialog);
    }
    this.setState({
      dayTypeInDialog: null,
      dayTypeIndexInDialog: -1
    });
  }

  render() {
    const { dayTypes } = this.props;
    const { dayTypeInDialog, dayTypeIndexInDialog } = this.state;

    return (
      <div className="day-types-editor">
        <IconButton
          icon={<AddIcon />}
          label="Legg til dagstype"
          labelPosition="right"
          onClick={::this.openDialogForNewDayType}
        />

        <DayTypesTable
          dayTypes={dayTypes}
          onRowClick={::this.openDialogForDayType}
          onDeleteClick={::this.deleteDayType}
        />

        {dayTypeInDialog !== null && (
          <Dialog
            isOpen={true}
            content={
              <DayTypeEditor
                dayType={dayTypeInDialog}
                onChange={dayTypeInDialog => this.setState({ dayTypeInDialog })}
                onSave={::this.handleOnDayTypeDialogSaveClick}
                isEditMode={dayTypeIndexInDialog !== -1}
              />
            }
            onClose={::this.closeDayTypeDialog}
          />
        )}
      </div>
    );
  }
}

DayTypesEditor.propTypes = {
  dayTypes: PropTypes.arrayOf(PropTypes.instanceOf(DayType)).isRequired,
  onChange: PropTypes.func.isRequired
};

export default DayTypesEditor;
