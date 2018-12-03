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
import { loadFlexibleLines } from '../../actions/flexibleLines';

import './styles.css';

class Lines extends Component {
  componentDidMount() {
    this.props.dispatch(loadFlexibleLines());
  }

  handleOnRowClick(id) {
    const { history } = this.props;
    history.push(`/lines/edit/${id}`);
  }

  render() {
    const { organisations, lines } = this.props;

    const renderTableRows = () => {
      if (lines) {
        return lines.length > 0 ? (
          lines.map(n => (
            <TableRow key={n.id} onClick={() => this.handleOnRowClick(n.id)}>
              <TableRowCell title={n.description}>{n.name}</TableRowCell>
              <TableRowCell>{n.privateCode}</TableRowCell>
              <TableRowCell>
                {organisations.find(o => o.id === n.operatorRef).name}
              </TableRowCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="row-no-lines disabled">
            <TableRowCell colSpan={3}>Ingen linjer ble funnet.</TableRowCell>
          </TableRow>
        );
      } else {
        return (
          <TableRow className="disabled">
            <TableRowCell colSpan={3}>
              <Loading text="Laster inn linjer..." />
            </TableRowCell>
          </TableRow>
        );
      }
    };

    return (
      <div className="lines">
        <h2>Linjer</h2>

        <Link to="/lines/create">
          <IconButton
            icon={<AddIcon />}
            label="Opprett linje"
            labelPosition="right"
          />
        </Link>

        <Table>
          <TableHeaderCell label="Navn" />
          <TableHeaderCell label="Privat kode" />
          <TableHeaderCell label="Operatør" />

          {renderTableRows()}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = ({ organisations, flexibleLines }) => ({
  organisations,
  lines: flexibleLines
});

export default compose(withRouter, connect(mapStateToProps))(Lines);
