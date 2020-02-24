import React, { Component } from 'react';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { DeleteIcon } from '@entur/icons';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  HeaderCell,
  DataCell
} from '@entur/table';
import ConfirmDialog from 'components/ConfirmDialog';

import './styles.scss';

type Props = {
  onDeleteClick: (number: number) => void;
  serviceJourneys: any[];
  onRowClick: (row: number) => void;
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
    const { serviceJourneys, onRowClick } = this.props;
    const { removeDialogOpenFor } = this.state;

    const tableRows =
      serviceJourneys.length > 0 ? (
        serviceJourneys.map((jp, i) => (
          <TableRow key={jp.id} onClick={() => onRowClick(i)}>
            <DataCell title={jp.description}>
              {jp.name ? jp.name : '- Nytt service journey -'}
            </DataCell>
            <DataCell>
              <div
                onClick={e => {
                  this.showDeleteDialogFor(i);
                  e.stopPropagation();
                }}
              >
                <DeleteIcon />
              </div>
            </DataCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-lines disabled">
          <DataCell colSpan={3}>Ingen service journeys.</DataCell>
        </TableRow>
      );

    return (
      <div>
        <Table className="service-journeys-table">
          <TableHead>
            <TableRow>
              <HeaderCell>Navn</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>

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
