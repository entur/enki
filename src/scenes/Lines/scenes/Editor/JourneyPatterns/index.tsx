import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { AddIcon, ValidationInfoIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { JourneyPattern } from 'model';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import Dialog from 'components/Dialog';
import JourneyPatternsTable from './Table';
import JourneyPatternEditor from './Editor';
import { selectIntl } from 'i18n';
import { setUnsavedChanges } from 'actions/editor';
import messages from './messages';
import './styles.scss';

const TEMP_INDEX = -1;

type Props = {
  journeyPatterns: any;
  onChange: (journeyPatterns: any[]) => void;
};

const JourneyPatternsEditor = ({ journeyPatterns, onChange }: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const [journeyPattern, setJourneyPattern] = useState<any | null>(null);
  const [journeyPatternIndex, setJourneyPatternIndex] = useState(TEMP_INDEX);
  const { isUnsaved } = useSelector((state: any) => state.editor);
  const dispatch = useDispatch();

  const deleteJourneyPattern = (index: number) => {
    onChange(removeElementByIndex(journeyPatterns, index));
  };

  const openDialogForNewJourneyPattern = () => {
    setJourneyPattern(new JourneyPattern());
  };

  const openDialogForJourneyPattern = (index: number) => {
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
      dispatch(setUnsavedChanges(true));
    }

    setJourneyPattern(null);
    setJourneyPatternIndex(TEMP_INDEX);
  };

  return (
    <div>
      <SecondaryButton onClick={openDialogForNewJourneyPattern}>
        <AddIcon />
        {formatMessage(messages.addJourneyPatternIconButtonLabel)}
      </SecondaryButton>

      <JourneyPatternsTable
        journeyPatterns={journeyPatterns}
        onRowClick={openDialogForJourneyPattern}
        onDeleteClick={deleteJourneyPattern}
      />
      {isUnsaved && (
        <div className="unsaved-changes">
          <ValidationInfoIcon inline /> Du har endringar som ikke er spart.
        </div>
      )}

      {journeyPattern !== null && (
        <Dialog
          isOpen={true}
          content={
            <JourneyPatternEditor
              journeyPattern={journeyPattern}
              onChange={setJourneyPattern}
              onSave={handleOnJourneyPatternDialogSaveClick}
              isEditMode={journeyPatternIndex !== TEMP_INDEX}
              onClose={closeJourneyPatternDialog}
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
  onChange: PropTypes.func.isRequired
};

export default JourneyPatternsEditor;
