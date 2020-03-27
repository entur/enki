import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import StopPoint from 'model/StopPoint';
import ServiceJourneyEditor from './Editor';
import { selectIntl } from 'i18n';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import AddButton from 'components/AddButton/AddButton';
import ServiceJourney from 'model/ServiceJourney';
import { Heading2, Paragraph } from '@entur/typography';
import { validateServiceJourney } from 'scenes/Lines/scenes/Editor/ServiceJourneys/Editor/validate';
import { ExpandablePanel } from '@entur/expand';
import ScrollToTop from 'components/ScrollToTop';
import { Modal } from '@entur/modal';
import { InputGroup, TextField } from '@entur/form';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import './styles.scss';

type Props = {
  serviceJourneys: ServiceJourney[];
  onChange: (sj: ServiceJourney[]) => void;
  stopPoints: StopPoint[];
  setIsValidServiceJourney: (isValid: boolean) => void;
  spoilPristine: boolean;
};

const ServiceJourneysEditor = ({
  serviceJourneys,
  onChange,
  stopPoints,
  setIsValidServiceJourney,
  spoilPristine,
}: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [keys, setKeys] = useState<number[]>(serviceJourneys.map(Math.random));
  const { formatMessage } = useSelector(selectIntl);
  const textFieldRef = useRef<HTMLInputElement>(null);

  const updateServiceJourney = (index: number, serviceJourney: any) => {
    onChange(replaceElement(serviceJourneys, index, serviceJourney));
  };
  const deleteServiceJourney = (index: number) => {
    onChange(removeElementByIndex(serviceJourneys, index));
  };
  const addNewServiceJourney = (name: string) => {
    const newServiceJourneys = [
      ...serviceJourneys,
      {
        name,
        passingTimes: stopPoints.map((_) => ({})),
      },
    ];
    onChange(newServiceJourneys);
    setKeys(newServiceJourneys.map(Math.random));
    setShowModal(false);
    setTimeout(
      () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
      100
    );
  };

  const renderServiceJourneyEditor = (sj: ServiceJourney, index: number) => {
    return (
      <ServiceJourneyEditor
        key={keys[index]}
        serviceJourney={sj}
        stopPoints={stopPoints}
        onChange={(serviceJourney) =>
          updateServiceJourney(index, serviceJourney)
        }
        spoilPristine={spoilPristine}
        deleteServiceJourney={
          serviceJourneys.length > 1
            ? () => deleteServiceJourney(index)
            : undefined
        }
      />
    );
  };

  useEffect(() => {
    setIsValidServiceJourney(
      serviceJourneys.every((sj) => validateServiceJourney(sj))
    );
  }, [serviceJourneys, setIsValidServiceJourney]);

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
              onClick={() =>
                addNewServiceJourney(textFieldRef?.current?.value ?? '')
              }
            >
              {formatMessage('modalCreate')}
            </PrimaryButton>
          </div>
        </div>
      </Modal>

      <ScrollToTop>
        <div className="service-journeys-editor">
          <Heading2>{formatMessage('editorServiceJourneys')}</Heading2>
          <Paragraph>{formatMessage('serviceJourneysInfo')}</Paragraph>
          {serviceJourneys.length === 1
            ? renderServiceJourneyEditor(serviceJourneys[0], 0)
            : serviceJourneys.map((sj, index) => (
                <ExpandablePanel
                  key={keys[index]}
                  title={sj.name}
                  defaultOpen={!sj.id && index === serviceJourneys.length - 1}
                >
                  {renderServiceJourneyEditor(sj, index)}
                </ExpandablePanel>
              ))}

          <AddButton
            onClick={() => setShowModal(true)}
            buttonTitle={formatMessage('editorAddServiceJourneys')}
          />
        </div>
      </ScrollToTop>
    </>
  );
};

export default ServiceJourneysEditor;
