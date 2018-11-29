import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
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
import ExportViewer from './scenes/Viewer';
import { EXPORT_STATUS } from '../../model/enums';

import './styles.css';

class Exports extends Component {
  componentDidMount() {
    this.props.dispatch(loadExports());
  }

  handleOnRowClick(id) {
    this.props.history.push(`/exports/view/${id}`);
  }

  render() {
    const { exports } = this.props;

    const renderTableRows = () => {
      if (exports) {
        return exports.length > 0 ? (
          exports.map(e => (
            <TableRow key={e.id} onClick={() => this.handleOnRowClick(e.id)}>
              <TableRowCell>{e.name}</TableRowCell>
              <TableRowCell>
                {ExportViewer.getIconForStatus(e.exportStatus)}
              </TableRowCell>
              <TableRowCell>
                {e.exportStatus === EXPORT_STATUS.SUCCESS && (
                  <a href={e.downloadUrl}>Last ned</a>
                )}
              </TableRowCell>
              <TableRowCell>{e.dryRun ? 'Ja' : 'Nei'}</TableRowCell>
              <TableRowCell>
                {moment(e.fromDate).format('DD.MM.YYYY')}
              </TableRowCell>
              <TableRowCell>
                {moment(e.toDate).format('DD.MM.YYYY')}
              </TableRowCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="row-no-exports disabled">
            <TableRowCell colSpan={6}>Ingen eksporter ble funnet.</TableRowCell>
          </TableRow>
        );
      } else {
        return (
          <TableRow className="disabled">
            <TableRowCell colSpan={6}>
              <Loading text="Laster inn eksporter..." />
            </TableRowCell>
          </TableRow>
        );
      }
    };

    return (
      <div className="exports">
        <h2>Eksporter</h2>

        <Link to={`${process.env.PUBLIC_URL}/exports/create`}>
          <IconButton
            icon={<AddIcon />}
            label="Opprett eksport"
            labelPosition="right"
          />
        </Link>

        <Table>
          <TableHeaderCell label="Navn" />
          <TableHeaderCell label="Status" />
          <TableHeaderCell label="Last ned" />
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
