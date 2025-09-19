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
import { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import './styles.scss';
import { getProviders } from '../../actions/providers';
import { useConfig } from 'config/ConfigContext';

const Providers = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const providersState = useAppSelector((s) => s.providers);
  const dispatch = useAppDispatch();
  const config = useConfig();
  const isLineMigrationEnabled = config?.enableLineMigration ?? false;

  useEffect(() => {
    dispatch(getProviders());
  }, []);

  const handleOnRowClick = useCallback(
    (id: string) => {
      navigate(`/providers/edit/${id}`);
    },
    [navigate],
  );

  const handleMigrateClick = useCallback(
    (providerId: string, event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent row click
      navigate(`/providers/${providerId}/migrate-line`);
    },
    [navigate],
  );

  const providers = useMemo(
    () => providersState?.providers?.slice().sort(sortProviders) || [],
    [providersState],
  );

  const isAdmin = useAppSelector((state) => state.userContext.isAdmin);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
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
          {isLineMigrationEnabled && (
            <DataCell className="action-cell">
              <SecondaryButton
                size="small"
                onClick={(event) => handleMigrateClick(n.code!, event)}
              >
                Migrate Lines
              </SecondaryButton>
            </DataCell>
          )}
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
                {isLineMigrationEnabled && <HeaderCell>Actions</HeaderCell>}
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
