import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import PropTypes from 'prop-types';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { ServiceJourney, StopPoint } from 'model';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import Dialog from 'components/Dialog';
import ServiceJourneysTable from './Table';
import ServiceJourneyEditor from './Editor';
import messages from '../messages';

const TEMP_INDEX = -1;

const ServiceJourneysEditor = ({ serviceJourneys, onChange, stopPoints }) => {
  const [serviceJourneyInDialog, setServiceJourneyInDialog] = useState(null);
  const [
    serviceJourneyIndexInDialog,
    setServiceJourneyIndexInDialog
  ] = useState(TEMP_INDEX);
  const { formatMessage } = useSelector(selectIntl);

  const updateServiceJourney = (index, serviceJourney) => {
    onChange(replaceElement(serviceJourneys, index, serviceJourney));
  };

  const deleteServiceJourney = index => {
    onChange(removeElementByIndex(serviceJourneys, index));
  };

  const openDialogForNewServiceJourney = () => {
    setServiceJourneyInDialog(new ServiceJourney());
  };

  const openDialogForServiceJourney = index => {
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
        onRowClick={openDialogForServiceJourney.bind(this)}
        onDeleteClick={deleteServiceJourney.bind(this)}
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
              onSave={handleOnServiceJourneyDialogSaveClick.bind(this)}
              isEditMode={serviceJourneyIndexInDialog !== TEMP_INDEX}
            />
          }
          onClose={closeServiceJourneyDialog}
        />
      )}
    </div>
  );
};

ServiceJourneysEditor.propTypes = {
  serviceJourneys: PropTypes.arrayOf(PropTypes.instanceOf(ServiceJourney))
    .isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onChange: PropTypes.func.isRequired
};

export default ServiceJourneysEditor;
