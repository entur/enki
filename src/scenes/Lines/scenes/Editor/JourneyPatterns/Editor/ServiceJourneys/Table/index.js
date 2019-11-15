import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DeleteIcon } from '@entur/component-library';

import {
  Table,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from 'components/Table';
import { ServiceJourney } from 'model';
import ConfirmDialog from 'components/ConfirmDialog';

import './styles.css';

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
          <TableRow key={i} onClick={() => onRowClick(i)}>
            <TableRowCell title={jp.description}>
              {jp.name ? jp.name : '- Nytt service journey -'}
            </TableRowCell>
            <TableRowCell>
              <div
                onClick={e => {
                  this.showDeleteDialogFor(i);
                  e.stopPropagation();
                }}
              >
                <DeleteIcon />
              </div>
            </TableRowCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-lines disabled">
          <TableRowCell colSpan={3}>Ingen service journeys.</TableRowCell>
        </TableRow>
      );

    return (
      <div>
        <Table className="service-journeys-table">
          <TableHeaderCell label="Navn" />
          {tableRows}
        </Table>

        <ConfirmDialog
          isOpen={removeDialogOpenFor !== null}
          title="Slette service journey"
          message="Er du sikker på at du ønsker å slette denne service journeyen?"
          buttons={[
            <Button
              key={2}
              onClick={() => this.showDeleteDialogFor(null)}
              variant="secondary"
              width="md"
              className="action-button"
            >
              Nei
            </Button>,
            <Button
              key={1}
              onClick={this.doDelete.bind(this)}
              variant="success"
              width="md"
              className="action-button"
            >
              Ja
            </Button>
          ]}
          onClose={() => this.showDeleteDialogFor(null)}
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
