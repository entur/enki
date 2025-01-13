import { Accordion, AccordionItem } from '@entur/expand';
import { Heading1, LeadParagraph } from '@entur/typography';
import AddButton from 'components/AddButton/AddButton';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import useUniqueKeys from 'hooks/useUniqueKeys';
import JourneyPattern, { initJourneyPattern } from 'model/JourneyPattern';
import { ReactElement, useState } from 'react';
import { useIntl } from 'react-intl';
import './styles.scss';
import StopPoint from '../../model/StopPoint';
import { createUuid } from '../../helpers/generators';
import NewJourneyPatternModal from './NewJourneyPatternModal';

type Props = {
  journeyPatterns: JourneyPattern[];
  onChange: (journeyPatterns: JourneyPattern[]) => void;
  children: (
    journeyPattern: JourneyPattern,
    journeyPatternsNames: string[],
    handleUpdate: (journeyPattern: JourneyPattern) => void,
    handleCopy: (jpName: string) => void,
    handleDelete?: () => void,
  ) => ReactElement;
};

const JourneyPatterns = ({ journeyPatterns, onChange, children }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const journeyPatternsNames: string[] = journeyPatterns
    ? journeyPatterns.map((jp) => jp?.name?.trim())
    : [];

  const keys = useUniqueKeys(journeyPatterns);

  const updateJourneyPattern = (index: number) => {
    return (journeyPattern: JourneyPattern) => {
      onChange(replaceElement(journeyPatterns, index, journeyPattern));
    };
  };

  const deleteJourneyPattern = (index: number) => {
    return () => {
      if (journeyPatterns.length > 1) {
        onChange(removeElementByIndex(journeyPatterns, index));
      }
    };
  };

  const addNewJourneyPattern = (name: string) => {
    const newJourneyPatterns = [
      ...journeyPatterns,
      {
        ...initJourneyPattern(),
        name,
      },
    ];
    onChange(newJourneyPatterns);
    setShowModal(false);
    setTimeout(
      () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
      100,
    );
  };

  const copyJourneyPattern = (
    journeyPatterns: JourneyPattern[],
    journeyPatternIndex: number,
    name: string,
  ) => {
    const journeyPatternToCopy = journeyPatterns[journeyPatternIndex];
    const newJourneyPattern: JourneyPattern = {
      ...journeyPatternToCopy,
      id: undefined,
      name: name,
    };
    newJourneyPattern.pointsInSequence =
      journeyPatternToCopy.pointsInSequence.map((point: StopPoint) => ({
        ...point,
        id: undefined,
        key: createUuid(),
      }));
    newJourneyPattern.serviceJourneys = [
      {
        id: `new_${createUuid()}`,
        passingTimes: journeyPatternToCopy.pointsInSequence.map((_) => ({})),
      },
    ];
    const newJourneyPatterns: JourneyPattern[] = [
      ...journeyPatterns,
      newJourneyPattern,
    ];
    onChange(newJourneyPatterns);
  };

  return (
    <>
      <NewJourneyPatternModal
        open={showModal}
        onSave={addNewJourneyPattern}
        onDismiss={() => setShowModal(false)}
        journeyPatternsNames={journeyPatternsNames}
      />

      <div className="journey-patterns-editor">
        <Heading1>
          {formatMessage({ id: 'editorJourneyPatternsTabLabel' })}
        </Heading1>
        <LeadParagraph>
          {formatMessage({ id: 'editorFillInformation' })}
        </LeadParagraph>
        {journeyPatterns.length === 1 ? (
          children(
            journeyPatterns[0],
            journeyPatternsNames,
            updateJourneyPattern(0),
            (name: string) => copyJourneyPattern(journeyPatterns, 0, name),
            undefined,
          )
        ) : (
          <Accordion>
            {journeyPatterns.map((jp: JourneyPattern, index: number) => (
              <AccordionItem
                title={jp.name}
                key={jp.id ?? keys[index]}
                defaultOpen={!jp.id || index === journeyPatterns.length - 1}
              >
                {children(
                  jp,
                  journeyPatternsNames,
                  updateJourneyPattern(index),
                  (name: string) =>
                    copyJourneyPattern(journeyPatterns, index, name),
                  deleteJourneyPattern(index),
                )}
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <AddButton
          onClick={() => setShowModal(true)}
          buttonTitle={formatMessage({ id: 'editorAddJourneyPatterns' })}
        />
      </div>
    </>
  );
};

export default JourneyPatterns;
