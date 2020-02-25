import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import ServiceJourneysTable from './Table';
import messages from '../messages';

type Props = {
  serviceJourneys: any[];
  onChange: (sj: any) => void;
  stopPoints: any[];
};

const ServiceJourneysEditor = ({
  serviceJourneys,
  onChange,
  stopPoints
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const updateServiceJourney = (index: number, serviceJourney: any) => {
    console.log();
    onChange(replaceElement(serviceJourneys, index, serviceJourney));
  };
  const deleteServiceJourney = (index: number) => {
    onChange(removeElementByIndex(serviceJourneys, index));
  };

  return (
    <div className="service-journeys-editor">
      <ServiceJourneysTable
        serviceJourneys={serviceJourneys}
        stopPoints={stopPoints}
        onChange={updateServiceJourney}
        // onSave={handleOnServiceJourneyDialogSaveClick}
        onDeleteClick={deleteServiceJourney}
      />

      <SecondaryButton onClick={() => undefined}>
        <AddIcon />
        {formatMessage(messages.addServiceJourneys)}
      </SecondaryButton>
    </div>
  );
};

export default ServiceJourneysEditor;
