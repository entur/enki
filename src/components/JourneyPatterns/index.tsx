import { PrimaryButton, SecondaryButton } from '@entur/button';
import { Accordion, AccordionItem } from '@entur/expand';
import { TextField } from '@entur/form';
import { Modal } from '@entur/modal';
import { Heading1, LeadParagraph } from '@entur/typography';
import AddButton from 'components/AddButton/AddButton';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import useUniqueKeys from 'hooks/useUniqueKeys';
import JourneyPattern, { initJourneyPattern } from 'model/JourneyPattern';
import { ReactElement, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import './styles.scss';
import ServiceJourney from '../../model/ServiceJourney';
import StopPoint from '../../model/StopPoint';
import { createUuid } from '../../helpers/generators';

type Props = {
  journeyPatterns: JourneyPattern[];
  onChange: (journeyPatterns: JourneyPattern[]) => void;
  children: (
    journeyPattern: JourneyPattern,
    handleUpdate: (journeyPattern: JourneyPattern) => void,
    handleDelete?: () => void,
    handleCopy?: (jpName: string) => void,
  ) => ReactElement;
};

const JourneyPatterns = ({ journeyPatterns, onChange, children }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const textFieldRef = useRef<HTMLInputElement>(null);

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
    const newJourneyPattern: JourneyPattern = {
      ...journeyPatterns[journeyPatternIndex],
    };
    newJourneyPattern.id = undefined;
    newJourneyPattern.name = name;
    newJourneyPattern.pointsInSequence = journeyPatterns[
      journeyPatternIndex
    ].pointsInSequence.map((point: StopPoint) => ({
      ...point,
      id: undefined,
      key: createUuid(),
    }));

    newJourneyPattern.serviceJourneys = [
      {
        id: `new_${createUuid()}`,
        name: undefined,
        passingTimes: journeyPatterns[journeyPatternIndex].pointsInSequence.map(
          (_) => ({}),
        ),
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
      <Modal
        size="small"
        open={showModal}
        title={formatMessage({ id: 'newJourneyPatternModalTitle' })}
        onDismiss={() => setShowModal(false)}
        className="modal"
      >
        {formatMessage({ id: 'newJourneyPatternModalSubTitle' })}
        <div className="modal-content">
          <TextField
            label={formatMessage({ id: 'newJourneyPatternModalLabel' })}
            className="modal-input"
            placeholder={formatMessage({
              id: 'newJourneyPatternModalPlaceholder',
            })}
            ref={textFieldRef}
          />
          <div className={'confirm-dialog-buttons'}>
            <SecondaryButton
              onClick={() => setShowModal(false)}
              className="margin-right"
            >
              {formatMessage({ id: 'newJourneyPatternModalCancel' })}
            </SecondaryButton>
            <PrimaryButton
              onClick={() =>
                addNewJourneyPattern(textFieldRef?.current?.value ?? '')
              }
            >
              {formatMessage({ id: 'newJourneyPatternModalCreate' })}
            </PrimaryButton>
          </div>
        </div>
      </Modal>

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
            updateJourneyPattern(0),
            undefined,
            (name: string) => copyJourneyPattern(journeyPatterns, 0, name),
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
                  updateJourneyPattern(index),
                  deleteJourneyPattern(index),
                  (name: string) =>
                    copyJourneyPattern(journeyPatterns, index, name),
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
