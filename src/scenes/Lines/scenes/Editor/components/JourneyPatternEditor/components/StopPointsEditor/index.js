import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AddIcon } from '@entur/component-library';

import IconButton from '../../../../../../../../components/IconButton';
import { StopPoint } from '../../../../../../../../model';
import { replaceElement } from '../../../../../../../../helpers/arrays';
import Dialog from '../../../../../../../../components/Dialog';
import StopPointsTable from '../StopPointsTable';
import StopPointEditor from './components/StopPointEditor';

import './styles.css';

class StopPointsEditor extends Component {
  state = {
    stopPointInDialog: null,
    stopPointIndexInDialog: -1
  };

  updateStopPoint(index, stopPlace) {
    const { stopPoints, onChange } = this.props;
    onChange(replaceElement(stopPoints, index, stopPlace));
  }

  deleteStopPlace(index) {
    const { stopPoints, onChange } = this.props;
    const copy = stopPoints.slice();
    copy.splice(index, 1);
    onChange(copy);
  }

  openDialogForNewStopPoint() {
    this.setState({ stopPointInDialog: new StopPoint() });
  }

  openDialogForStopPoint(index) {
    this.setState({
      stopPointInDialog: this.props.stopPoints[index],
      stopPointIndexInDialog: index
    });
  }

  closeStopPointDialog() {
    this.setState({
      stopPointInDialog: null,
      stopPointIndexInDialog: -1
    });
  }

  handleOnStopPointDialogSaveClick() {
    const { stopPoints, onChange } = this.props;
    const { stopPointInDialog, stopPointIndexInDialog } = this.state;
    if (stopPointIndexInDialog === -1) {
      onChange(stopPoints.concat(stopPointInDialog));
    } else {
      this.updateStopPoint(stopPointIndexInDialog, stopPointInDialog);
    }
    this.setState({
      stopPointInDialog: null,
      stopPointIndexInDialog: -1
    });
  }

  render() {
    const { stopPoints } = this.props;
    const { stopPointInDialog, stopPointIndexInDialog } = this.state;

    return (
      <div className="stop-points-editor">
        <IconButton
          icon={<AddIcon />}
          label="Legg til stoppepunkt"
          labelPosition="right"
          onClick={::this.openDialogForNewStopPoint}
        />

        <StopPointsTable
          stopPoints={stopPoints}
          onRowClick={::this.openDialogForStopPoint}
          onDeleteClick={::this.deleteStopPlace}
        />

        {stopPointInDialog !== null && (
          <Dialog
            isOpen={true}
            content={
              <StopPointEditor
                stopPoint={stopPointInDialog}
                onChange={stopPointInDialog =>
                  this.setState({ stopPointInDialog })
                }
                onSave={::this.handleOnStopPointDialogSaveClick}
                isEditMode={stopPointIndexInDialog !== -1}
              />
            }
            onClose={::this.closeStopPointDialog}
          />
        )}
      </div>
    );
  }
}

StopPointsEditor.propTypes = {
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onChange: PropTypes.func.isRequired
};

export default StopPointsEditor;
