import React, { Component } from 'react';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { ExpandablePanel } from '@entur/expand';
import ServiceJourneyEditor from '../Editor';
import ConfirmDialog from 'components/ConfirmDialog';

import './styles.scss';

type Props = {
  onDeleteClick: (number: number) => void;
  serviceJourneys: any[];
  stopPoints: any[];
  onChange: (serviceJourney: any, index: number) => void;
};

type State = {
  removeDialogOpenFor: number | null;
};

class ServiceJourneysTable extends Component<Props, State> {
  readonly state: State = { removeDialogOpenFor: null };

  showDeleteDialogFor = (jp: number | null) => {
    this.setState({ removeDialogOpenFor: jp });
  };

  doDelete = () => {
    const { removeDialogOpenFor } = this.state;
    if (removeDialogOpenFor) {
      this.props.onDeleteClick(removeDialogOpenFor);
      this.showDeleteDialogFor(-1);
    }
  };

  render() {
    const { serviceJourneys, stopPoints, onChange } = this.props;
    const { removeDialogOpenFor } = this.state;

    const test = () =>
      serviceJourneys.map((sj, index) => (
        <ExpandablePanel key={sj.id} title={sj?.name}>
          <ServiceJourneyEditor
            serviceJourney={sj}
            stopPoints={stopPoints}
            onChange={serviceJourney => onChange(index, serviceJourney)}
          />
        </ExpandablePanel>
      ));

    return (
      <div>
        {test()}

        <ConfirmDialog
          isOpen={removeDialogOpenFor !== null}
          title="Slette service journey"
          message="Er du sikker på at du ønsker å slette denne service journeyen?"
          buttons={[
            <SecondaryButton
              key={2}
              onClick={() => this.showDeleteDialogFor(null)}
            >
              Nei
            </SecondaryButton>,
            <SuccessButton key={1} onClick={this.doDelete}>
              Ja
            </SuccessButton>
          ]}
          onDismiss={() => this.showDeleteDialogFor(null)}
        />
      </div>
    );
  }
}

export default ServiceJourneysTable;
