import { SecondaryButton } from '@entur/button';
import { AddIcon } from '@entur/icons';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { Heading1, Paragraph } from '@entur/typography';
import Loading from 'components/Loading';
import Provider, { sortProviders } from 'model/Provider';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import './styles.scss';

const Providers = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const providersState = useAppSelector((s) => s.providers);

  const handleOnRowClick = useCallback(
    (id: string) => {
      navigate(`/providers/edit/${id}`);
    },
    [history],
  );

  const providers = useMemo(
    () => providersState?.providers?.slice().sort(sortProviders) || [],
    [providersState],
  );

  const isAdmin = useAppSelector((state) => state.userContext.isAdmin);

  if (!isAdmin) {
    navigate('/');
  }

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
      <Heading1>{formatMessage({ id: 'providersHeaderText' })}</Heading1>
      {providers.length === 0 && (
        <Paragraph>
          {formatMessage({ id: 'noProvidersDescriptionText' })}
        </Paragraph>
      )}

      <SecondaryButton className="create" as={Link} to="/providers/create">
        <AddIcon />
        {formatMessage({ id: 'createProviderHeaderText' })}
      </SecondaryButton>

      <Loading
        text={formatMessage({ id: 'providersLoading' })}
        isLoading={!providers}
      >
        <>
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell>
                  {formatMessage({ id: 'providersNameTableHeaderLabel' })}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage({ id: 'providersCodeTableHeaderLabel' })}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage({ id: 'providersCodespaceXmlnsHeaderLabel' })}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage({
                    id: 'providersCodespaceXmlnsUrlHeaderLabel',
                  })}
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
