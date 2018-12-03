import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AddIcon } from '@entur/component-library';

import {
  Table,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from '../../components/Table';
import Loading from '../../components/Loading';
import IconButton from '../../components/IconButton';
import { loadFlexibleStopPlaces } from '../../actions/flexibleStopPlaces';

import './styles.css';

class StopPlaces extends Component {
  componentDidMount() {
    this.props.dispatch(loadFlexibleStopPlaces());
  }

  handleOnRowClick(id) {
    const { history } = this.props;
    history.push(`/stop-places/edit/${id}`);
  }

  render() {
    const { stopPlaces } = this.props;

    const renderTableRows = () => {
      if (stopPlaces) {
        return stopPlaces.length > 0 ? (
          stopPlaces.map(sp => (
            <TableRow
              key={sp.id}
              onClick={() => this.handleOnRowClick(sp.id)}
              title={sp.description}
            >
              <TableRowCell>{sp.name}</TableRowCell>
              <TableRowCell>{sp.privateCode}</TableRowCell>
              <TableRowCell>
                {sp.flexibleArea.polygon.coordinates.length - 1}
              </TableRowCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="row-no-stop-places disabled">
            <TableRowCell colSpan={3}>
              Ingen stoppesteder ble funnet.
            </TableRowCell>
          </TableRow>
        );
      } else {
        return (
          <TableRow className="disabled">
            <TableRowCell colSpan={3}>
              <Loading text="Laster inn stoppesteder..." />
            </TableRowCell>
          </TableRow>
        );
      }
    };

    return (
      <div className="stop-places">
        <h2>Stoppesteder</h2>

        <Link to="/stop-places/create">
          <IconButton
            icon={<AddIcon />}
            label="Opprett stoppested"
            labelPosition="right"
          />
        </Link>

        <Table>
          <TableHeaderCell label="Navn" />
          <TableHeaderCell label="Privat kode" />
          <TableHeaderCell label="Antall punkter" />

          {renderTableRows()}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = ({ flexibleStopPlaces }) => ({
  stopPlaces: flexibleStopPlaces
});

export default compose(withRouter, connect(mapStateToProps))(StopPlaces);
