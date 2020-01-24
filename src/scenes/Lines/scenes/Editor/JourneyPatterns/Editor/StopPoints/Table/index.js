import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@entur/component-library';
import { DeleteIcon } from '@entur/icons';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  HeaderCell,
  DataCell
} from '@entur/table';
import { StopPoint } from 'model';
import ConfirmDialog from 'components/ConfirmDialog';

import './styles.scss';

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
            <DataCell>{i + 1}</DataCell>
            <DataCell>
              {sp.flexibleStopPlaceRef
                ? flexibleStopPlaces.find(
                    fsp => fsp.id === sp.flexibleStopPlaceRef
                  ).name
                : sp.quayRef
                ? sp.quayRef
                : '- Nytt stoppepunkt -'}
            </DataCell>
            <DataCell>
              {sp.destinationDisplay ? sp.destinationDisplay.frontText : ''}
            </DataCell>
            <DataCell>{sp.forBoarding ? 'Ja' : 'Nei'}</DataCell>
            <DataCell>{sp.forAlighting ? 'Ja' : 'Nei'}</DataCell>
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
          <DataCell colSpan={3}>Ingen stoppepunkter.</DataCell>
        </TableRow>
      );

    return (
      <div>
        <Table className="stop-points-table">
          <TableHead>
            <TableRow>
              <HeaderCell>#</HeaderCell>
              <HeaderCell>Navn</HeaderCell>
              <HeaderCell>Front text</HeaderCell>
              <HeaderCell>Påstigning</HeaderCell>
              <HeaderCell>Avstigning</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
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
              onClick={this.doDelete.bind(this)} // TODO
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
