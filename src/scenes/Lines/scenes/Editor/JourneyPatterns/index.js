import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { AddIcon } from '@entur/component-library';

import IconButton from 'components/IconButton';
import { JourneyPattern, StopPoint } from 'model';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import Dialog from 'components/Dialog';
import JourneyPatternsTable from './Table';
import JourneyPatternEditor from './Editor';
import { selectIntl } from 'i18n';
import messages from './messages';

const TEMP_INDEX = -1;

const JourneyPatternsEditor = ({ journeyPatterns, stopPoints, onChange }) => {
  const { formatMessage } = useSelector(selectIntl);
  const [journeyPattern, setJourneyPattern] = useState(null);
  const [journeyPatternIndex, setJourneyPatternIndex] = useState(TEMP_INDEX);

  const deleteJourneyPattern = index => {
    onChange(removeElementByIndex(journeyPatterns, index));
  };

  const openDialogForNewJourneyPattern = () => {
    setJourneyPattern(new JourneyPattern());
  };

  const openDialogForJourneyPattern = index => {
    setJourneyPattern(journeyPatterns[index]);
    setJourneyPatternIndex(index);
  };

  const closeJourneyPatternDialog = () => {
    setJourneyPattern(null);
    setJourneyPatternIndex(TEMP_INDEX);
  };

  const handleOnJourneyPatternDialogSaveClick = () => {
    if (journeyPatternIndex === TEMP_INDEX) {
      onChange(journeyPatterns.concat(journeyPattern));
    } else {
      onChange(
        replaceElement(journeyPatterns, journeyPatternIndex, journeyPattern)
      );
    }

    setJourneyPattern(null);
    setJourneyPatternIndex(TEMP_INDEX);
  };

  return (
    <div className="journey-patterns-editor">
      <IconButton
        icon={<AddIcon />}
        label={formatMessage(messages.addJourneyPatternIconButtonLabel)}
        labelPosition="right"
        onClick={openDialogForNewJourneyPattern}
      />

      <JourneyPatternsTable
        journeyPatterns={journeyPatterns}
        onRowClick={openDialogForJourneyPattern}
        onDeleteClick={deleteJourneyPattern}
      />

      {journeyPattern !== null && (
        <Dialog
          isOpen={true}
          content={
            <JourneyPatternEditor
              journeyPattern={journeyPattern}
              stopPoints={stopPoints}
              onChange={setJourneyPattern}
              onSave={handleOnJourneyPatternDialogSaveClick}
              isEditMode={journeyPatternIndex !== TEMP_INDEX}
            />
          }
          onClose={closeJourneyPatternDialog}
        />
      )}
    </div>
  );
};

JourneyPatternsEditor.propTypes = {
  journeyPatterns: PropTypes.arrayOf(PropTypes.instanceOf(JourneyPattern))
    .isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)),
  onChange: PropTypes.func.isRequired
};

export default JourneyPatternsEditor;
