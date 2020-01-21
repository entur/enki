import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import {
  Table,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from 'components/Table';
import Loading from 'components/Loading';
import { loadNetworks } from 'actions/networks';
import { selectIntl } from 'i18n';
import messages from './messages';
import './styles.scss';

const Networks = ({ history }) => {
  const { formatMessage } = useSelector(selectIntl);
  const { activeProvider, organisations, networks } = useSelector(
    ({ providers, organisations, networks }) => ({
      activeProvider: providers.active,
      organisations,
      networks
    })
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadNetworks());
  }, [dispatch, activeProvider]);

  const handleOnRowClick = useCallback(
    id => {
      history.push(`/networks/edit/${id}`);
    },
    [history]
  );

  const renderTableRows = () => {
    if (networks) {
      return networks.length > 0 ? (
        networks.map(n => (
          <TableRow
            key={n.id}
            onClick={() => handleOnRowClick(n.id)}
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
          <TableRowCell colSpan={3}>
            {formatMessage(messages.noNetworksFoundText)}
          </TableRowCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <TableRowCell colSpan={3}>
            <Loading text={formatMessage(messages.loadingNetworksText)} />
          </TableRowCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="networks">
      <h2>{formatMessage(messages.headerText)}</h2>

      <SecondaryButton
        as={Link}
        to="/networks/create"
        className="new-network-button"
      >
        <AddIcon />
        {formatMessage(messages.createNetworkIconButtonLabel)}
      </SecondaryButton>

      <Table>
        <TableHeaderCell label={formatMessage(messages.nameTableHeaderLabel)} />
        <TableHeaderCell
          label={formatMessage(messages.privateCodeTableHeaderLabel)}
        />
        <TableHeaderCell
          label={formatMessage(messages.authorityTableHeaderLabel)}
        />

        {renderTableRows()}
      </Table>
    </div>
  );
};

export default withRouter(Networks);
