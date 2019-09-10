import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, DeleteIcon } from '@entur/component-library';

import {
  Table,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from '../../../../../../../../components/Table';
import { StopPoint } from '../../../../../../../../model';
import ConfirmDialog from '../../../../../../../../components/ConfirmDialog';

import './styles.css';

class StopPointsTable extends Component {
  state = { removeDialogOpenFor: null };

  showDeleteDialogFor(sp) {
    this.setState({ removeDialogOpenFor: sp });
  }

  doDelete() {
    this.props.onDeleteClick(this.state.removeDialogOpenFor);
    this.showDeleteDialogFor(null);
  }

  render() {
    const { flexibleStopPlaces, stopPoints, onRowClick } = this.props;
    const { removeDialogOpenFor } = this.state;

    const tableRows =
      stopPoints.length > 0 ? (
        stopPoints.map((sp, i) => (
          <TableRow key={i} onClick={() => onRowClick(i)}>
            <TableRowCell>{i + 1}</TableRowCell>
            <TableRowCell>
              {sp.flexibleStopPlaceRef
                ? flexibleStopPlaces.find(
                    fsp => fsp.id === sp.flexibleStopPlaceRef
                  ).name
                : '- Nytt stoppepunkt -'}
            </TableRowCell>
            <TableRowCell>{sp.forBoarding ? 'Ja' : 'Nei'}</TableRowCell>
            <TableRowCell>{sp.forAlighting ? 'Ja' : 'Nei'}</TableRowCell>
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
          <TableRowCell colSpan={3}>Ingen stoppepunkter.</TableRowCell>
        </TableRow>
      );

    return (
      <div>
        <Table className="stop-points-table">
          <TableHeaderCell label="#" />
          <TableHeaderCell label="Navn" />
          <TableHeaderCell label="Påstigning" />
          <TableHeaderCell label="Avstigning" />
          {tableRows}
        </Table>

        <ConfirmDialog
          isOpen={removeDialogOpenFor !== null}
          title="Slette stoppepunkt"
          message="Er du sikker på at du ønsker å slette dette stoppepunktet?"
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

StopPointsTable.propTypes = {
  stopPoints: PropTypes.arrayOf(PropTypes.instanceOf(StopPoint)).isRequired,
  onRowClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

const mapStateToProps = ({ flexibleStopPlaces }) => ({ flexibleStopPlaces });

export default connect(mapStateToProps)(StopPointsTable);
