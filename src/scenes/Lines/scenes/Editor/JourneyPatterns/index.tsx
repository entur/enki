import React, { useEffect } from 'react';
import { JourneyPattern } from 'model';
import { ExpandablePanel } from '@entur/expand';
import { replaceElement } from 'helpers/arrays';
import JourneyPatternEditor from './Editor';
import './styles.scss';

type Props = {
  journeyPatterns: JourneyPattern[];
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
  useEffect(() => {
    if (!journeyPatterns.length)
      onChange(journeyPatterns.concat(new JourneyPattern()));
  }, [journeyPatterns, onChange]);

  const handleSave = (journeyPattern: JourneyPattern, index: number) => {
    onChange(replaceElement(journeyPatterns, index, journeyPattern));
  };
  return (
    <div>
      {journeyPatterns.length === 1 ? (
        <JourneyPatternEditor
          journeyPattern={journeyPatterns[0]}
          onSave={handleSave}
          index={0}
          setIsValidServiceJourney={setIsValidServiceJourney}
          setIsValidStopPoints={setIsValidServiceJourney}
        />
      ) : (
        journeyPatterns.map((jp: JourneyPattern, index: number) => (
          <ExpandablePanel
            title={jp.name}
            key={index}
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
        ))
      )}
    </div>
  );
};

export default JourneyPatternsEditor;
