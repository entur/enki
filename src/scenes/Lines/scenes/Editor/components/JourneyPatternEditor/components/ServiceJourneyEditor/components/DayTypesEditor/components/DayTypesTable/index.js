import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DeleteIcon } from '@entur/component-library';

import {
  Table,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from '../../../../../../../../../../../../components/Table';
import { DayType } from '../../../../../../../../../../../../model';
import ConfirmDialog from '../../../../../../../../../../../../components/ConfirmDialog';

import './styles.css';

class DayTypesTable extends Component {
  state = { removeDialogOpenFor: null };

  showDeleteDialogFor(dt) {
    this.setState({ removeDialogOpenFor: dt });
  }

  doDelete() {
    this.props.onDeleteClick(this.state.removeDialogOpenFor);
    this.showDeleteDialogFor(null);
  }

  render() {
    const { dayTypes, onRowClick } = this.props;
    const { removeDialogOpenFor } = this.state;

    const tableRows =
      dayTypes.length > 0 ? (
        dayTypes.map((dt, i) => (
          <TableRow key={i} onClick={() => onRowClick(i)}>
            <TableRowCell>{dt.name ? dt.name : '- Ny dagstype -'}</TableRowCell>
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
          <TableRowCell colSpan={2}>Ingen dagstyper.</TableRowCell>
        </TableRow>
      );

    return (
      <div>
        <Table className="day-types-table">
          <TableHeaderCell label="Navn" />
          {tableRows}
        </Table>

        <ConfirmDialog
          isOpen={removeDialogOpenFor !== null}
          title="Slette dagstype"
          message="Er du sikker på at du ønsker å slette denne dagstypen?"
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
              onClick={::this.doDelete}
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

DayTypesTable.propTypes = {
  dayTypes: PropTypes.arrayOf(PropTypes.instanceOf(DayType)).isRequired,
  onRowClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

export default DayTypesTable;
