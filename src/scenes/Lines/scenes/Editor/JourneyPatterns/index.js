import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AddIcon } from '@entur/component-library';

import IconButton from 'components/IconButton';
import { JourneyPattern } from 'model';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import Dialog from 'components/Dialog';
import JourneyPatternsTable from './Table';
import JourneyPatternEditor from './Editor';

const TEMP_INDEX = -1;

class JourneyPatternsEditor extends Component {
  state = {
    journeyPatternInDialog: null,
    journeyPatternIndexInDialog: TEMP_INDEX
  };

  updateServiceJourney(index, journeyPattern) {
    const { journeyPatterns, onChange } = this.props;
    onChange(replaceElement(journeyPatterns, index, journeyPattern));
  }

  deleteJourneyPattern(index) {
    const { journeyPatterns, onChange } = this.props;
    onChange(removeElementByIndex(journeyPatterns, index));
  }

  openDialogForNewJourneyPattern() {
    this.setState({ journeyPatternInDialog: new JourneyPattern() });
  }

  openDialogForJourneyPattern(index) {
    this.setState({
      journeyPatternInDialog: this.props.journeyPatterns[index],
      journeyPatternIndexInDialog: index
    });
  }

  closeJourneyPatternDialog() {
    this.setState({
      journeyPatternInDialog: null,
      journeyPatternIndexInDialog: TEMP_INDEX
    });
  }

  handleOnJourneyPatternDialogSaveClick() {
    const { journeyPatterns, onChange } = this.props;
    const { journeyPatternInDialog, journeyPatternIndexInDialog } = this.state;
    if (journeyPatternIndexInDialog === TEMP_INDEX) {
      onChange(journeyPatterns.concat(journeyPatternInDialog));
    } else {
      this.updateServiceJourney(
        journeyPatternIndexInDialog,
        journeyPatternInDialog
      );
    }
    this.setState({
      journeyPatternInDialog: null,
      journeyPatternIndexInDialog: TEMP_INDEX
    });
  }

  render() {
    const { journeyPatterns, stopPoints } = this.props;
    const { journeyPatternInDialog, journeyPatternIndexInDialog } = this.state;

    return (
      <div className="journey-patterns-editor">
        <IconButton
          icon={<AddIcon />}
          label="Legg til journey pattern"
          labelPosition="right"
          onClick={this.openDialogForNewJourneyPattern.bind(this)}
        />

        <JourneyPatternsTable
          journeyPatterns={journeyPatterns}
          onRowClick={this.openDialogForJourneyPattern.bind(this)}
          onDeleteClick={this.deleteJourneyPattern.bind(this)}
        />

        {journeyPatternInDialog !== null && (
          <Dialog
            isOpen={true}
            content={
              <JourneyPatternEditor
                journeyPattern={journeyPatternInDialog}
                stopPoints={stopPoints}
                onChange={journeyPatternInDialog =>
                  this.setState({ journeyPatternInDialog })
                }
                onSave={this.handleOnJourneyPatternDialogSaveClick.bind(this)}
                isEditMode={journeyPatternIndexInDialog !== TEMP_INDEX}
              />
            }
            onClose={this.closeJourneyPatternDialog.bind(this)}
          />
        )}
      </div>
    );
  }
}

JourneyPatternsEditor.propTypes = {
  journeyPatterns: PropTypes.arrayOf(PropTypes.instanceOf(JourneyPattern))
    .isRequired,
  onChange: PropTypes.func.isRequired
};

export default JourneyPatternsEditor;
