import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AddIcon } from '@entur/component-library';

import IconButton from 'components/IconButton';
import { ServiceJourney, StopPoint } from 'model';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import Dialog from 'components/Dialog';
import ServiceJourneysTable from './Table';
import ServiceJourneyEditor from './Editor';

const TEMP_INDEX = -1;

class ServiceJourneysEditor extends Component {
  state = {
    serviceJourneyInDialog: null,
    serviceJourneyIndexInDialog: TEMP_INDEX
  };

  updateServiceJourney(index, serviceJourney) {
    const { serviceJourneys, onChange } = this.props;
    onChange(replaceElement(serviceJourneys, index, serviceJourney));
  }

  deleteServiceJourney(index) {
    const { serviceJourneys, onChange } = this.props;
    onChange(removeElementByIndex(serviceJourneys, index));
  }

  openDialogForNewServiceJourney() {
    this.setState({ serviceJourneyInDialog: new ServiceJourney() });
  }

  openDialogForServiceJourney(index) {
    this.setState({
      serviceJourneyInDialog: this.props.serviceJourneys[index],
      serviceJourneyIndexInDialog: index
    });
  }

  closeServiceJourneyDialog() {
    this.setState({
      serviceJourneyInDialog: null,
      serviceJourneyIndexInDialog: TEMP_INDEX
    });
  }

  handleOnServiceJourneyDialogSaveClick() {
    const { serviceJourneys, onChange } = this.props;
    const { serviceJourneyInDialog, serviceJourneyIndexInDialog } = this.state;
    if (serviceJourneyIndexInDialog === TEMP_INDEX) {
      onChange(serviceJourneys.concat(serviceJourneyInDialog));
    } else {
      this.updateServiceJourney(
        serviceJourneyIndexInDialog,
        serviceJourneyInDialog
      );
    }
    this.setState({
      serviceJourneyInDialog: null,
      serviceJourneyIndexInDialog: TEMP_INDEX
    });
  }

  render() {
    const { serviceJourneys, stopPoints } = this.props;
    const { serviceJourneyInDialog, serviceJourneyIndexInDialog } = this.state;

    return (
      <div className="service-journeys-editor">
        <IconButton
          icon={<AddIcon />}
          label="Legg til service journey"
          labelPosition="right"
          onClick={this.openDialogForNewServiceJourney.bind(this)}
        />

        <ServiceJourneysTable
          serviceJourneys={serviceJourneys}
          onRowClick={this.openDialogForServiceJourney.bind(this)}
          onDeleteClick={this.deleteServiceJourney.bind(this)}
        />

        {serviceJourneyInDialog !== null && (
          <Dialog
            isOpen={true}
            content={
              <ServiceJourneyEditor
                serviceJourney={serviceJourneyInDialog}
                stopPoints={stopPoints}
                onChange={serviceJourneyInDialog =>
                  this.setState({ serviceJourneyInDialog })
                }
                onSave={this.handleOnServiceJourneyDialogSaveClick.bind(this)}
                isEditMode={serviceJourneyIndexInDialog !== TEMP_INDEX}
              />
            }
            onClose={this.closeServiceJourneyDialog.bind(this)}
          />
        )}
      </div>
    );
  }
}

ServiceJourneysEditor.propTypes = {
  serviceJourneys: PropTypes.arrayOf(PropTypes.instanceOf(ServiceJourney))
    .isRequired,
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onChange: PropTypes.func.isRequired
};

export default ServiceJourneysEditor;
