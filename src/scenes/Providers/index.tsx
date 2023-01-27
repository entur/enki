import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import Loading from 'components/Loading';
import { Heading1 } from '@entur/typography';
import { selectIntl } from 'i18n';
import './styles.scss';
import { GlobalState } from 'reducers';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import Provider from 'model/Provider';

const Providers = ({ history }: RouteComponentProps) => {
  const { formatMessage } = useSelector(selectIntl);
  const { providers: providersState } = useSelector<GlobalState, GlobalState>(
    (s) => s
  );

  const handleOnRowClick = useCallback(
    (id) => {
      history.push(`/providers/edit/${id}`);
    },
    [history]
  );

  const providers = providersState.providers;

  const RenderTableRows = ({
    providerList,
  }: {
    providerList: Provider[] | null;
  }) => (
    <>
      {providerList?.map((n) => (
        <TableRow
          key={n.code}
          onClick={() => handleOnRowClick(n.code)}
          title={n.name}
        >
          <DataCell>{n.name}</DataCell>
          <DataCell>{n.code}</DataCell>
          <DataCell>{n.codespace?.xmlns}</DataCell>
          <DataCell>{n.codespace?.xmlnsUrl}</DataCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <div className="providers">
      <Heading1>{formatMessage('providersHeaderText')}</Heading1>

      <SecondaryButton className="create" as={Link} to="/providers/create">
        <AddIcon />
        {formatMessage('createProviderHeaderText')}
      </SecondaryButton>

      <Loading text={formatMessage('providersLoading')} isLoading={!providers}>
        <>
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell>
                  {formatMessage('providersNameTableHeaderLabel')}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage('providersCodeTableHeaderLabel')}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage('providersCodespaceXmlnsHeaderLabel')}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage('providersCodespaceXmlnsUrlHeaderLabel')}
                </HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <RenderTableRows providerList={providers} />
            </TableBody>
          </Table>
        </>
      </Loading>
    </div>
  );
};

export default withRouter(Providers);