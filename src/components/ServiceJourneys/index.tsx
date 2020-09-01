import React, { ReactElement, useState, useRef } from 'react';
import ServiceJourney from 'model/ServiceJourney';
import { Modal } from '@entur/modal';
import { selectIntl } from 'i18n';
import { useSelector } from 'react-redux';
import { InputGroup, TextField } from '@entur/form';
import { SecondaryButton, PrimaryButton } from '@entur/button';
import {
  replaceElement,
  removeElementByIndex,
  changeElementAtIndex,
} from 'helpers/arrays';
import { Heading1, LeadParagraph, Heading3 } from '@entur/typography';
import StopPoint from 'model/StopPoint';
import { Accordion, AccordionItem } from '@entur/expand';
import AddButton from 'components/AddButton/AddButton';
import './styles.scss';
import useUniqueKeys from 'hooks/useUniqueKeys';
import JourneyPattern from 'model/JourneyPattern';
import { Dropdown } from '@entur/dropdown';

type Props = {
  journeyPatterns: JourneyPattern[];
  onChange: (journeyPatterns: JourneyPattern[]) => void;
  children: (
    serviceJourney: ServiceJourney,
    stopPoints: StopPoint[],
    handleUpdate: (serviceJourney: ServiceJourney) => void,
    handleDelete?: () => void
  ) => ReactElement;
};

export default ({ journeyPatterns, onChange, children }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { formatMessage } = useSelector(selectIntl);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [
    modalSelectedJourneyPatternIndex,
    setModalSelectedJourneyPatternIndex,
  ] = useState<number>(0);

  const keys = useUniqueKeys(journeyPatterns);

  const updateServiceJourney = (
    index: number,
    serviceJourneys: ServiceJourney[],
    journeyPatternIndex: number
  ) => {
    return (serviceJourney: ServiceJourney) => {
      onChange(
        changeElementAtIndex(
          journeyPatterns,
          {
            ...journeyPatterns[journeyPatternIndex],
            serviceJourneys: replaceElement(
              serviceJourneys,
              index,
              serviceJourney
            ),
          },
          journeyPatternIndex
        )
      );
    };
  };

  const deleteServiceJourney = (
    index: number,
    serviceJourneys: ServiceJourney[],
    journeyPatternIndex: number
  ) => {
    return () => {
      if (serviceJourneys.length > 1) {
        onChange(
          changeElementAtIndex(
            journeyPatterns,
            {
              ...journeyPatterns[journeyPatternIndex],
              serviceJourneys: removeElementByIndex(serviceJourneys, index),
            },
            journeyPatternIndex
          )
        );
      }
    };
  };

  const addNewServiceJourney = (
    name: string,
    serviceJourneys: ServiceJourney[],
    stopPoints: StopPoint[],
    journeyPatternIndex: number
  ) => {
    const newServiceJourneys = [
      ...serviceJourneys,
      {
        name,
        passingTimes: stopPoints.map((_) => ({})),
      },
    ];
    onChange(
      changeElementAtIndex(
        journeyPatterns,
        {
          ...journeyPatterns[journeyPatternIndex],
          serviceJourneys: newServiceJourneys,
        },
        journeyPatternIndex
      )
    );
    setShowModal(false);
    setTimeout(
      () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
      100
    );
  };

  return (
    <>
      <Modal
        size="small"
        open={showModal}
        title={formatMessage('newServiceJourneyModalTitle')}
        onDismiss={() => setShowModal(false)}
        className="modal"
      >
        {formatMessage('newServiceJourneyModalSubTitle')}
        <div className="modal-content">
          <InputGroup
            label={formatMessage('newServiceJourneyModalNameLabel')}
            className="modal-input"
          >
            <TextField
              placeholder={formatMessage('newServiceJourneyModalPlaceholder')}
              ref={textFieldRef}
            />
          </InputGroup>
          <Dropdown
            label={formatMessage('newServiceJourneyModalJourneyPatternLabel')}
            className="modal-input"
            items={journeyPatterns?.map((jp, i) => ({
              value: keys[i],
              label: jp.name || '',
            }))}
            value={keys[modalSelectedJourneyPatternIndex]}
            onChange={(selected) =>
              setModalSelectedJourneyPatternIndex(
                keys.indexOf(selected?.value!)
              )
            }
          />
          <div>
            <SecondaryButton
              onClick={() => setShowModal(false)}
              className="margin-right"
            >
              {formatMessage('newServiceJourneyModalCancel')}
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                const jp = journeyPatterns[modalSelectedJourneyPatternIndex];
                addNewServiceJourney(
                  textFieldRef?.current?.value ?? '',
                  jp.serviceJourneys,
                  jp.pointsInSequence,
                  0
                );
              }}
            >
              {formatMessage('newServiceJourneyModalCreate')}
            </PrimaryButton>
          </div>
        </div>
      </Modal>

      <div className="service-journeys-editor">
        <Heading1>{formatMessage('editorServiceJourneys')}</Heading1>
        <LeadParagraph>{formatMessage('serviceJourneysInfo')}</LeadParagraph>
        {journeyPatterns.length === 1 &&
        journeyPatterns.flatMap((jp) => jp.serviceJourneys).length === 1
          ? children(
              journeyPatterns[0].serviceJourneys[0],
              journeyPatterns[0].pointsInSequence,
              updateServiceJourney(0, journeyPatterns[0].serviceJourneys, 0)
            )
          : journeyPatterns.map((jp, jpIndex) => (
              <>
                {journeyPatterns.length > 1 && <Heading3>{jp.name}</Heading3>}
                <Accordion>
                  {jp.serviceJourneys.map((sj, sjIndex) => (
                    <AccordionItem
                      key={keys[jpIndex] + sjIndex}
                      title={sj.name}
                      defaultOpen={
                        jpIndex === modalSelectedJourneyPatternIndex &&
                        (!sj.id || sjIndex === jp.serviceJourneys.length - 1)
                      }
                    >
                      {children(
                        sj,
                        journeyPatterns[jpIndex].pointsInSequence,
                        updateServiceJourney(
                          sjIndex,
                          journeyPatterns[jpIndex].serviceJourneys,
                          jpIndex
                        ),
                        jp.serviceJourneys.length > 1
                          ? deleteServiceJourney(
                              sjIndex,
                              journeyPatterns[jpIndex].serviceJourneys,
                              jpIndex
                            )
                          : undefined
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            ))}
        <AddButton
          onClick={() => setShowModal(true)}
          buttonTitle={formatMessage('editorAddServiceJourneys')}
        />
      </div>
    </>
  );
};
