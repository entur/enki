import React, { ReactElement, useState, useRef } from 'react';
import { ExpandablePanel } from '@entur/expand';
import { replaceElement, useUniqueKeys } from 'helpers/arrays';
import JourneyPattern from 'model/JourneyPattern';
import './styles.scss';
import { LeadParagraph, Heading1 } from '@entur/typography';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import AddButton from 'components/AddButton/AddButton';
import ScrollToTop from 'components/ScrollToTop';
import { Modal } from '@entur/modal';
import { InputGroup, TextField } from '@entur/form';
import { SecondaryButton, PrimaryButton } from '@entur/button';

type Props = {
  journeyPatterns: JourneyPattern[];
  onChange: (journeyPatterns: JourneyPattern[]) => void;
  children: (
    journeyPattern: JourneyPattern,
    index: number,
    onSave: (journeyPattern: JourneyPattern, index: number) => void
  ) => ReactElement;
};

const JourneyPatternsEditor = ({
  journeyPatterns,
  onChange,
  children,
}: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { formatMessage } = useSelector(selectIntl);
  const handleSave = (journeyPattern: JourneyPattern, index: number) => {
    onChange(replaceElement(journeyPatterns, index, journeyPattern));
  };
  const keys = useUniqueKeys(journeyPatterns);
  const textFieldRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Modal
        size="small"
        open={showModal}
        title={formatMessage('modalTitle')}
        onDismiss={() => setShowModal(false)}
        className="modal"
      >
        {formatMessage('modalSubTitle')}
        <div className="modal-content">
          <InputGroup
            label={formatMessage('modalLabel')}
            className="modal-input"
          >
            <TextField
              placeholder={formatMessage('modalPlaceholder')}
              ref={textFieldRef}
            />
          </InputGroup>
          <div>
            <SecondaryButton
              onClick={() => setShowModal(false)}
              className="margin-right"
            >
              {formatMessage('modalCancel')}
            </SecondaryButton>
            <PrimaryButton
              onClick={
                () => {}
                //addNewServiceJourney(textFieldRef?.current?.value ?? '')
              }
            >
              {formatMessage('modalCreate')}
            </PrimaryButton>
          </div>
        </div>
      </Modal>
      <ScrollToTop>
        <div className="journey-patterns-editor">
          <Heading1>{formatMessage('editorJourneyPatternsTabLabel')}</Heading1>
          <LeadParagraph>
            {formatMessage('editorFillInformation')}
          </LeadParagraph>
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
          {/* <AddButton
            onClick={() => setShowModal(true)}
            buttonTitle={formatMessage('editorAddJourneyPatterns')}
          /> */}
        </div>
      </ScrollToTop>
    </>
  );
};

export default JourneyPatternsEditor;
