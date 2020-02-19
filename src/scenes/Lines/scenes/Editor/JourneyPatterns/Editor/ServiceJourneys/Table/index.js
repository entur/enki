import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import { ServiceJourney } from 'model';
import ConfirmDialog from 'components/ConfirmDialog';

import './styles.scss';

class ServiceJourneysTable extends Component {
  state = { removeDialogOpenFor: null };

  showDeleteDialogFor(jp) {
    this.setState({ removeDialogOpenFor: jp });
  }

  doDelete() {
    this.props.onDeleteClick(this.state.removeDialogOpenFor);
    this.showDeleteDialogFor(null);
  }

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
            <SuccessButton key={1} onClick={this.doDelete.bind(this)}>
              Ja
            </SuccessButton>
          ]}
          onDismiss={() => this.showDeleteDialogFor(null)}
        />
      </div>
    );
  }
}

ServiceJourneysTable.propTypes = {
  serviceJourneys: PropTypes.arrayOf(PropTypes.instanceOf(ServiceJourney))
    .isRequired,
  onRowClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

export default ServiceJourneysTable;
