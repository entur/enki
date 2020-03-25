import React, { useEffect } from 'react';
import { ExpandablePanel } from '@entur/expand';
import { replaceElement, useUniqueKeys } from 'helpers/arrays';
import JourneyPatternEditor from './Editor';
import './styles.scss';
import JourneyPattern from 'model/JourneyPattern';

type Props = {
  journeyPatterns: JourneyPattern[];
  onChange: (journeyPatterns: JourneyPattern[]) => void;
  setIsValidJourneyPattern: (isValid: boolean) => void;
  spoilPristine: boolean;
};

const JourneyPatternsEditor = ({
  journeyPatterns,
  onChange,
  setIsValidJourneyPattern,
  spoilPristine
}: Props) => {
  useEffect(() => {
    if (!journeyPatterns.length)
      onChange([
        {
          pointsInSequence: [{}, {}],
          serviceJourneys: [{ passingTimes: [{}, {}] }]
        }
      ]);
  }, [journeyPatterns, onChange]);

  const handleSave = (journeyPattern: JourneyPattern, index: number) => {
    onChange(replaceElement(journeyPatterns, index, journeyPattern));
  };

  const keys = useUniqueKeys(journeyPatterns);

  return (
    <div>
      {journeyPatterns.length === 1 ? (
        <JourneyPatternEditor
          journeyPattern={journeyPatterns[0]}
          onSave={handleSave}
          index={0}
          setIsValidJourneyPattern={setIsValidJourneyPattern}
          spoilPristine={spoilPristine}
        />
      ) : (
        journeyPatterns.map((jp: JourneyPattern, index: number) => (
          <ExpandablePanel
            title={jp.name}
            key={jp.id ?? keys[index]}
            defaultOpen={journeyPatterns.length === 1}
          >
            <JourneyPatternEditor
              journeyPattern={jp}
              onSave={handleSave}
              index={index}
              setIsValidJourneyPattern={setIsValidJourneyPattern}
              spoilPristine={spoilPristine}
            />
          </ExpandablePanel>
        ))
      )}
    </div>
  );
};

export default JourneyPatternsEditor;
