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
import { loadExports } from '../../actions/exports';

import './styles.css';

class Exports extends Component {
  componentDidMount() {
    this.props.dispatch(loadExports());
  }

  handleOnRowClick(id) {
    const { history } = this.props;
    history.push(`/exports/view/${id}`);
  }

  render() {
    const { exports } = this.props;

    const renderTableRows = () => {
      if (exports) {
        return exports.length > 0 ? (
          exports.map(e => (
            <TableRow key={e.id} onClick={() => this.handleOnRowClick(e.id)}>
              <TableRowCell>{e.name}</TableRowCell>
              <TableRowCell>{e.dryRun ? 'Ja' : 'Nei'}</TableRowCell>
              <TableRowCell>{e.fromDate}</TableRowCell>
              <TableRowCell>{e.toDate}</TableRowCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="row-no-exports disabled">
            <TableRowCell colSpan={4}>Ingen eksporter ble funnet.</TableRowCell>
          </TableRow>
        );
      } else {
        return (
          <TableRow className="disabled">
            <TableRowCell colSpan={4}>
              <Loading text="Laster inn eksporter..." />
            </TableRowCell>
          </TableRow>
        );
      }
    };

    return (
      <div className="exports">
        <h2>Eksporter</h2>

        <Link to="/exports/create">
          <IconButton
            icon={<AddIcon />}
            label="Opprett eksport"
            labelPosition="right"
          />
        </Link>

        <Table>
          <TableHeaderCell label="Navn" />
          <TableHeaderCell label="Tørrkjøring" />
          <TableHeaderCell label="Fra dato" />
          <TableHeaderCell label="Til dato" />

          {renderTableRows()}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = ({ exports }) => ({ exports });

export default compose(withRouter, connect(mapStateToProps))(Exports);
