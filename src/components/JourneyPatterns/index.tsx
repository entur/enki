import React, { ReactElement } from 'react';
import { ExpandablePanel } from '@entur/expand';
import { replaceElement, useUniqueKeys } from 'helpers/arrays';
import JourneyPattern from 'model/JourneyPattern';
import './styles.scss';
import { LeadParagraph, Heading1 } from '@entur/typography';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';

type Props = {
  journeyPatterns: JourneyPattern[];
  onChange: (journeyPatterns: JourneyPattern[]) => void;
  children: (
    journeyPattern: JourneyPattern,
    index: number,
    onSave: (journeyPattern: JourneyPattern, index: number) => void
  ) => ReactElement;
};

const JourneyPatterns = ({ journeyPatterns, onChange, children }: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const handleSave = (journeyPattern: JourneyPattern, index: number) => {
    onChange(replaceElement(journeyPatterns, index, journeyPattern));
  };
  const keys = useUniqueKeys(journeyPatterns);

  return (
    <div className="journey-patterns-editor">
      <Heading1>{formatMessage('editorJourneyPatternsTabLabel')}</Heading1>
      <LeadParagraph>{formatMessage('editorFillInformation')}</LeadParagraph>
      {journeyPatterns.length === 1
        ? children(journeyPatterns[0], 0, handleSave)
        : journeyPatterns.map((jp: JourneyPattern, index: number) => (
            <ExpandablePanel
              title={jp.name}
              key={jp.id ?? keys[index]}
              defaultOpen={journeyPatterns.length === 1}
            >
              children(jp, index, handleSave)
            </ExpandablePanel>
          ))}
    </div>
  );
};

export default JourneyPatterns;
