import React from 'react';
import { useSelector } from 'react-redux';
import { ServiceJourney, StopPoint } from 'model';
import ServiceJourneyEditor from './Editor';
import { selectIntl } from 'i18n';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import { ExpandablePanel } from '@entur/expand';
import messages from '../messages';

type Props = {
  serviceJourneys: ServiceJourney[];
  onChange: (sj: any) => void;
  stopPoints: StopPoint[];
  setIsValidServiceJourney: (isValid: boolean) => void;
};

const ServiceJourneysEditor = ({
  serviceJourneys,
  onChange,
  stopPoints,
  setIsValidServiceJourney
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const updateServiceJourney = (index: number, serviceJourney: any) => {
    onChange(replaceElement(serviceJourneys, index, serviceJourney));
  };
  const deleteServiceJourney = (index: number) => {
    onChange(removeElementByIndex(serviceJourneys, index));
  };
  const addNewServiceJourney = () => {
    onChange(serviceJourneys.concat(new ServiceJourney()));
  };

  return (
    <div className="service-journeys-editor">
      {serviceJourneys.map((sj, index) => (
        <ExpandablePanel key={sj.id ?? index} title={sj.name}>
          <ServiceJourneyEditor
            serviceJourney={sj}
            stopPoints={stopPoints}
            onChange={serviceJourney =>
              updateServiceJourney(index, serviceJourney)
            }
            setIsValidServiceJourney={setIsValidServiceJourney}
            deleteServiceJourney={() => deleteServiceJourney(index)}
          />
        </ExpandablePanel>
      ))}

      <SecondaryButton
        style={{ marginTop: '2rem' }}
        onClick={addNewServiceJourney}
      >
        <AddIcon />
        {formatMessage(messages.addServiceJourneys)}
      </SecondaryButton>
    </div>
  );
};

export default ServiceJourneysEditor;
