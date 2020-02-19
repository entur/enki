import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { ServiceJourney } from 'model';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import Dialog from 'components/Dialog';
import ServiceJourneysTable from './Table';
import ServiceJourneyEditor from './Editor';
import messages from '../messages';

const TEMP_INDEX = -1;

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
  const [serviceJourneyInDialog, setServiceJourneyInDialog] = useState<
    any | null
  >(null);
  const [
    serviceJourneyIndexInDialog,
    setServiceJourneyIndexInDialog
  ] = useState(TEMP_INDEX);
  const { formatMessage } = useSelector(selectIntl);

  const updateServiceJourney = (index: number, serviceJourney: any) => {
    onChange(replaceElement(serviceJourneys, index, serviceJourney));
  };

  const deleteServiceJourney = (index: number) => {
    onChange(removeElementByIndex(serviceJourneys, index));
  };

  const openDialogForNewServiceJourney = () => {
    setServiceJourneyInDialog(new ServiceJourney());
  };

  const openDialogForServiceJourney = (index: number) => {
    setServiceJourneyInDialog(serviceJourneys[index]);
    setServiceJourneyIndexInDialog(index);
  };

  const closeServiceJourneyDialog = () => {
    setServiceJourneyInDialog(null);
    setServiceJourneyIndexInDialog(TEMP_INDEX);
  };

  const handleOnServiceJourneyDialogSaveClick = () => {
    if (serviceJourneyIndexInDialog === TEMP_INDEX) {
      onChange(serviceJourneys.concat(serviceJourneyInDialog));
    } else {
      updateServiceJourney(serviceJourneyIndexInDialog, serviceJourneyInDialog);
    }
    setServiceJourneyInDialog(null);
    setServiceJourneyIndexInDialog(TEMP_INDEX);
  };

  return (
    <div className="service-journeys-editor">
      <SecondaryButton onClick={() => openDialogForNewServiceJourney()}>
        <AddIcon />
        {formatMessage(messages.addServiceJourneys)}
      </SecondaryButton>

      <ServiceJourneysTable
        serviceJourneys={serviceJourneys}
        onRowClick={openDialogForServiceJourney}
        onDeleteClick={deleteServiceJourney}
      />

      {serviceJourneyInDialog !== null && (
        <Dialog
          isOpen={true}
          content={
            <ServiceJourneyEditor
              serviceJourney={serviceJourneyInDialog}
              stopPoints={stopPoints}
              onChange={serviceJourneyInDialog =>
                setServiceJourneyInDialog(serviceJourneyInDialog)
              }
              onClose={closeServiceJourneyDialog}
              onSave={handleOnServiceJourneyDialogSaveClick}
              isEditMode={serviceJourneyIndexInDialog !== TEMP_INDEX}
            />
          }
          onClose={closeServiceJourneyDialog}
        />
      )}
    </div>
  );
};

export default ServiceJourneysEditor;
