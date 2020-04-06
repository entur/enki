import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
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
import { GlobalState } from 'reducers';
import { Network } from 'model/Network';
import { Organisation } from 'reducers/organisations';

const Networks = ({ history }: RouteComponentProps) => {
  const { formatMessage } = useSelector(selectIntl);
  const { providers, organisations, networks } = useSelector<
    GlobalState,
    GlobalState
  >((s) => s);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadNetworks());
  }, [dispatch, providers.active]);

  const handleOnRowClick = useCallback(
    (id) => {
      history.push(`/networks/edit/${id}`);
    },
    [history]
  );

  const RenderTableRows = ({
    networkList,
    organisationList,
  }: {
    networkList: Network[];
    organisationList: Organisation[];
  }) => (
    <>
      {networkList.map((n) => (
        <TableRow
          key={n.id}
          onClick={() => handleOnRowClick(n.id)}
          title={n.description}
        >
          <DataCell>{n.name}</DataCell>
          <DataCell>{n.privateCode}</DataCell>
          <DataCell>
            {organisationList.find((o) => o.id === n.authorityRef)?.name ?? '-'}
          </DataCell>
        </TableRow>
      ))}
      {networkList.length === 0 && (
        <TableRow className="row-no-networks disabled">
          <DataCell colSpan={3}>
            {formatMessage('networksNoNetworksFoundText')}
          </DataCell>
        </TableRow>
      )}
    </>
  );

  return (
    <div className="networks">
      <PageHeader
        title={formatMessage('networksHeaderText')}
        withBackButton={false}
      />
      <Loading
        text={formatMessage('networksLoadingNetworksText')}
        isLoading={!networks || !organisations}
      >
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
          <TableBody>
            <RenderTableRows
              networkList={networks!}
              organisationList={organisations!}
            />
          </TableBody>
        </Table>
      </Loading>
    </div>
  );
};

export default withRouter(Networks);
