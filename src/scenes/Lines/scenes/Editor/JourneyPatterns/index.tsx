import React from 'react';
import { ExpandablePanel } from '@entur/expand';
import { replaceElement, useUniqueKeys } from 'helpers/arrays';
import JourneyPatternEditor from './Editor';
import JourneyPattern from 'model/JourneyPattern';
import './styles.scss';

type Props = {
  journeyPatterns: JourneyPattern[];
  onChange: (journeyPatterns: JourneyPattern[]) => void;
  setIsValidJourneyPattern: (isValid: boolean) => void;
  flexibleLineType: string | undefined;
  spoilPristine: boolean;
};

const JourneyPatternsEditor = ({
  journeyPatterns,
  onChange,
  setIsValidJourneyPattern,
  spoilPristine,
  flexibleLineType,
}: Props) => {
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
          flexibleLineType={flexibleLineType}
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
              flexibleLineType={flexibleLineType}
            />
          </ExpandablePanel>
        ))
      )}
    </div>
  );
};

export default JourneyPatternsEditor;
