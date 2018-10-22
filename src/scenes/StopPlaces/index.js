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
import { capitalize } from 'lodash';

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
          stopPlaces.map(n => (
            <TableRow key={n.id} onClick={() => this.handleOnRowClick(n.id)}>
              <TableRowCell title={n.description}>{n.name}</TableRowCell>
              <TableRowCell>{n.privateCode}</TableRowCell>
              <TableRowCell>{capitalize(n.transportMode)}</TableRowCell>
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

        <Link to={'/stop-places/create'}>
          <IconButton
            icon={<AddIcon />}
            label="Opprett stoppested"
            labelPosition="right"
          />
        </Link>

        <Table>
          <TableHeaderCell label="Navn" />
          <TableHeaderCell label="Privat kode" />
          <TableHeaderCell label="Type transport" />

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
