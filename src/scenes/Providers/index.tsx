import Add from '@mui/icons-material/Add';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Loading from 'components/Loading';
import Provider, { sortProviders } from 'model/Provider';
import { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
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
    (providerId: string, event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
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
          <TableCell>{n.name}</TableCell>
          <TableCell>{n.code}</TableCell>
          <TableCell>{n.codespace?.xmlns}</TableCell>
          <TableCell>{n.codespace?.xmlnsUrl}</TableCell>
          {isLineMigrationEnabled && (
            <TableCell sx={{ width: 150, minWidth: 150 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{ whiteSpace: 'nowrap' }}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  handleMigrateClick(n.code!, event)
                }
              >
                Migrate Lines
              </Button>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <Typography variant="h1">
        {formatMessage({ id: 'providersHeaderText' })}
      </Typography>
      {providers.length === 0 && (
        <Typography variant="body1">
          {formatMessage({ id: 'noProvidersDescriptionText' })}
        </Typography>
      )}

      <Button
        variant="outlined"
        component={Link}
        to="/providers/create"
        sx={{ alignSelf: 'flex-start' }}
      >
        <Add />
        {formatMessage({ id: 'createProviderHeaderText' })}
      </Button>

      <Loading
        text={formatMessage({ id: 'providersLoading' })}
        isLoading={!providers}
      >
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {formatMessage({ id: 'providersNameTableHeaderLabel' })}
                </TableCell>
                <TableCell>
                  {formatMessage({ id: 'providersCodeTableHeaderLabel' })}
                </TableCell>
                <TableCell>
                  {formatMessage({ id: 'providersCodespaceXmlnsHeaderLabel' })}
                </TableCell>
                <TableCell>
                  {formatMessage({
                    id: 'providersCodespaceXmlnsUrlHeaderLabel',
                  })}
                </TableCell>
                {isLineMigrationEnabled && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              <RenderTableRows providerList={providers} />
            </TableBody>
          </Table>
        </>
      </Loading>
    </Stack>
  );
};

export default Providers;
