import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AddIcon, ValidationInfoIcon } from '@entur/icons';
import { ExpandablePanel } from '@entur/expand';
import { SecondaryButton } from '@entur/button';
import { JourneyPattern } from 'model';
import { replaceElement } from 'helpers/arrays';
import JourneyPatternEditor from './Editor';
import { selectIntl } from 'i18n';
import { setSavedChanges } from 'actions/editor';
import messages from './messages';
import './styles.scss';

type Props = {
  journeyPatterns: any;
  onChange: (journeyPatterns: any[]) => void;
  setIsValidServiceJourney: (isValid: boolean) => void;
  setIsValidStopPoints: (isValid: boolean) => void;
};

const JourneyPatternsEditor = ({
  journeyPatterns,
  onChange,
  setIsValidServiceJourney,
  setIsValidStopPoints
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const { isSaved } = useSelector((state: any) => state.editor);
  const dispatch = useDispatch();

  const handleSave = (journeyPattern: JourneyPattern, index?: number) => {
    if (index === undefined)
      return onChange(journeyPatterns.concat(journeyPattern));
    onChange(replaceElement(journeyPatterns, index, journeyPattern));
    dispatch(setSavedChanges(true));
  };

  return (
    <div>
      {journeyPatterns?.length === 0 && (
        <SecondaryButton onClick={() => handleSave(new JourneyPattern())}>
          <AddIcon />
          {formatMessage(messages.addJourneyPatternIconButtonLabel)}
        </SecondaryButton>
      )}

      {!isSaved && (
        <div className="unsaved-changes">
          <ValidationInfoIcon inline /> {formatMessage(messages.unsavedChanges)}
        </div>
      )}

      {journeyPatterns.map((jp: any, index: number) => (
        <ExpandablePanel
          title={jp.name}
          key={jp.name ?? index}
          defaultOpen={journeyPatterns.length === 1}
        >
          <JourneyPatternEditor
            journeyPattern={jp}
            onSave={handleSave}
            index={index}
            setIsValidServiceJourney={setIsValidServiceJourney}
            setIsValidStopPoints={setIsValidStopPoints}
          />
        </ExpandablePanel>
      ))}
    </div>
  );
};

export default JourneyPatternsEditor;
