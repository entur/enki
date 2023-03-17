import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import Loading from 'components/Loading';
import { Heading1, Paragraph } from '@entur/typography';
import { selectIntl } from 'i18n';
import './styles.scss';
import { GlobalState } from 'reducers';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import Provider, { sortProviders } from 'model/Provider';

const Providers = () => {
  const navigate = useNavigate();
  const { formatMessage } = useSelector(selectIntl);
  const { providers: providersState } = useSelector<GlobalState, GlobalState>(
    (s) => s
  );

  const handleOnRowClick = useCallback(
    (id: string) => {
      navigate(`/providers/edit/${id}`);
    },
    [history]
  );

  const providers = useMemo(
    () => providersState?.providers?.slice().sort(sortProviders) || [],
    [providersState]
  );

  const RenderTableRows = ({
    providerList,
  }: {
    providerList: Provider[] | null;
  }) => (
    <>
      {providerList?.map((n) => (
        <TableRow
          key={n.code}
          onClick={() => handleOnRowClick(n.code!)}
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
      {providers.length === 0 && (
        <Paragraph>{formatMessage('noProvidersDescriptionText')}</Paragraph>
      )}

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

export default Providers;
