import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DeleteIcon } from '@entur/component-library';

import {
  Table,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from '../../../../../../components/Table';
import { JourneyPattern } from '../../../../../../model';
import ConfirmDialog from '../../../../../../components/ConfirmDialog';

import './styles.css';

class JourneyPatternsTable extends Component {
  state = { removeDialogOpenFor: null };

  showDeleteDialogFor(jp) {
    this.setState({ removeDialogOpenFor: jp });
  }

  doDelete() {
    this.props.onDeleteClick(this.state.removeDialogOpenFor);
    this.showDeleteDialogFor(null);
  }

  render() {
    const { journeyPatterns, onRowClick } = this.props;
    const { removeDialogOpenFor } = this.state;

    const tableRows =
      journeyPatterns.length > 0 ? (
        journeyPatterns.map((jp, i) => (
          <TableRow
            key={i}
            title={jp.description}
            onClick={() => onRowClick(i)}
          >
            <TableRowCell>
              {jp.name ? jp.name : '- Nytt journey pattern -'}
            </TableRowCell>
            <TableRowCell>{jp.directionType || ''}</TableRowCell>
            <TableRowCell>{jp.pointsInSequence.length}</TableRowCell>
            <TableRowCell>{jp.serviceJourneys.length}</TableRowCell>
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
          <TableRowCell colSpan={3}>Ingen journey patterns.</TableRowCell>
        </TableRow>
      );

    return (
      <div>
        <Table className="journey-patterns-table">
          <TableHeaderCell label="Navn" />
          <TableHeaderCell label="Retning" />
          <TableHeaderCell label="Stoppesteder" />
          <TableHeaderCell label="Service Journeys" />
          {tableRows}
        </Table>

        <ConfirmDialog
          isOpen={removeDialogOpenFor !== null}
          title="Slette journey pattern"
          message="Er du sikker på at du ønsker å slette dette journey patternet?"
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

JourneyPatternsTable.propTypes = {
  journeyPatterns: PropTypes.arrayOf(PropTypes.instanceOf(JourneyPattern))
    .isRequired,
  onRowClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

export default JourneyPatternsTable;
