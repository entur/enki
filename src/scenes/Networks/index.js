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
import { loadNetworks } from '../../actions/networks';

import './styles.css';

class Networks extends Component {
  componentDidMount() {
    this.props.dispatch(loadNetworks());
  }

  handleOnRowClick(id) {
    const { history } = this.props;
    history.push(`/networks/edit/${id}`);
  }

  render() {
    const { organisations, networks } = this.props;

    const renderTableRows = () => {
      if (networks) {
        return networks.length > 0 ? (
          networks.map(n => (
            <TableRow
              key={n.id}
              onClick={() => this.handleOnRowClick(n.id)}
              title={n.description}
            >
              <TableRowCell>{n.name}</TableRowCell>
              <TableRowCell>{n.privateCode}</TableRowCell>
              <TableRowCell>
                {organisations.find(o => o.id === n.authorityRef).name}
              </TableRowCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="row-no-networks disabled">
            <TableRowCell colSpan={3}>Ingen nettverk ble funnet.</TableRowCell>
          </TableRow>
        );
      } else {
        return (
          <TableRow className="disabled">
            <TableRowCell colSpan={3}>
              <Loading text="Laster inn nettverk..." />
            </TableRowCell>
          </TableRow>
        );
      }
    };

    return (
      <div className="networks">
        <h2>Nettverk</h2>

        <Link to={'/networks/create'}>
          <IconButton
            icon={<AddIcon />}
            label="Opprett nettverk"
            labelPosition="right"
          />
        </Link>

        <Table>
          <TableHeaderCell label="Navn" />
          <TableHeaderCell label="Privat kode" />
          <TableHeaderCell label="Autoritet" />

          {renderTableRows()}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = ({ organisations, networks }) => ({
  organisations: organisations.organisations,
  networks
});

export default compose(withRouter, connect(mapStateToProps))(Networks);
