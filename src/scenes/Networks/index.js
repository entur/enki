import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/table';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import { loadNetworks } from 'actions/networks';
import { selectIntl } from 'i18n';
import './styles.scss';

const Networks = ({ history }) => {
  const { formatMessage } = useSelector(selectIntl);
  const { activeProvider, organisations, networks } = useSelector(
    ({ providers, organisations, networks }) => ({
      activeProvider: providers.active,
      organisations,
      networks,
    })
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadNetworks());
  }, [dispatch, activeProvider]);

  const handleOnRowClick = useCallback(
    (id) => {
      history.push(`/networks/edit/${id}`);
    },
    [history]
  );

  const renderTableRows = () => {
    if (networks) {
      return networks.length > 0 ? (
        networks.map((n) => (
          <TableRow
            key={n.id}
            onClick={() => handleOnRowClick(n.id)}
            title={n.description}
          >
            <DataCell>{n.name}</DataCell>
            <DataCell>{n.privateCode}</DataCell>
            <DataCell>
              {organisations.find((o) => o.id === n.authorityRef).name}
            </DataCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-networks disabled">
          <DataCell colSpan={3}>
            {formatMessage('networksNoNetworksFoundText')}
          </DataCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <DataCell colSpan={3}>
            <Loading text={formatMessage('networksLoadingNetworksText')} />
          </DataCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="networks">
      <PageHeader title={formatMessage('networksHeaderText')} />

      <SecondaryButton
        as={Link}
        to="/networks/create"
        className="new-network-button"
      >
        <AddIcon />
        {formatMessage('networksCreateNetworkIconButtonLabel')}
      </SecondaryButton>

      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell>
              {formatMessage('networksNameTableHeaderLabel')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('networksPrivateCodeTableHeaderLabel')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('networksAuthorityTableHeaderLabel')}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </div>
  );
};

export default withRouter(Networks);
