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
import ScrollToTop from 'components/ScrollToTop';
import { Heading1, LeadParagraph } from '@entur/typography';
import StopPoint from 'model/StopPoint';
import { ExpandablePanel } from '@entur/expand';
import AddButton from 'components/AddButton/AddButton';
import './styles.scss';
import useUniqueKeys from 'hooks/useUniqueKeys';
import JourneyPattern from 'model/JourneyPattern';

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
            label={formatMessage('newServiceJourneyModalLabel')}
            className="modal-input"
          >
            <TextField
              placeholder={formatMessage('newServiceJourneyModalPlaceholder')}
              ref={textFieldRef}
            />
          </InputGroup>
          <div>
            <SecondaryButton
              onClick={() => setShowModal(false)}
              className="margin-right"
            >
              {formatMessage('newServiceJourneyModalCancel')}
            </SecondaryButton>
            <PrimaryButton
              onClick={() =>
                addNewServiceJourney(
                  textFieldRef?.current?.value ?? '',
                  journeyPatterns[0].serviceJourneys,
                  journeyPatterns[0].pointsInSequence,
                  0
                )
              }
            >
              {formatMessage('newServiceJourneyModalCreate')}
            </PrimaryButton>
          </div>
        </div>
      </Modal>

      <ScrollToTop>
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
            : journeyPatterns.flatMap((jp, jpIndex) =>
                jp.serviceJourneys.map((sj, sjIndex) => (
                  <ExpandablePanel
                    key={keys[jpIndex] + sjIndex}
                    title={sj.name}
                    defaultOpen={
                      !sj.id &&
                      sjIndex === journeyPatterns[0].serviceJourneys.length - 1
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
                      deleteServiceJourney(
                        sjIndex,
                        journeyPatterns[jpIndex].serviceJourneys,
                        jpIndex
                      )
                    )}
                  </ExpandablePanel>
                ))
              )}
          <AddButton
            onClick={() => setShowModal(true)}
            buttonTitle={formatMessage('editorAddServiceJourneys')}
          />
        </div>
      </ScrollToTop>
    </>
  );
};
