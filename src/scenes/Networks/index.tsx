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
import { deleteNetworkById, loadNetworks } from 'actions/networks';
import Loading from 'components/Loading';
import { Network } from 'model/Network';
import { Organisation } from 'model/Organisation';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ConfirmDialog from '../../components/ConfirmDialog';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import './styles.scss';

const Networks = () => {
  const navigate = useNavigate();
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(
    undefined,
  );
  const intl = useIntl();
  const { formatMessage } = intl;
  const activeProviderCode = useAppSelector(
    (state) => state.userContext.activeProviderCode,
  );
  const organisations = useAppSelector((state) => state.organisations);
  const networks = useAppSelector((state) => state.networks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadNetworks(intl));
  }, [dispatch, activeProviderCode, intl]);

  const handleOnRowClick = useCallback(
    (id: string) => {
      navigate(`/networks/edit/${id}`);
    },
    [navigate],
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
          onClick={() => handleOnRowClick(n.id!)}
          title={n.description}
        >
          <TableCell>{n.name}</TableCell>
          <TableCell>{n.privateCode}</TableCell>
          <TableCell>
            {organisationList.find((o) => o.id === n.authorityRef)?.name
              ?.value ?? '-'}
          </TableCell>
          <TableCell className="delete-row-cell">
            <DeleteButton
              onClick={() => {
                setSelectedNetwork(n);
                setShowDeleteDialogue(true);
              }}
              title=""
              thin
            />
          </TableCell>
        </TableRow>
      ))}
      {networkList.length === 0 && (
        <TableRow className="row-no-networks disabled">
          <TableCell colSpan={3}>
            {formatMessage({ id: 'networksNoNetworksFoundText' })}
          </TableCell>
        </TableRow>
      )}
    </>
  );

  return (
    <div className="networks">
      <Typography variant="h1">
        {formatMessage({ id: 'networksHeaderText' })}
      </Typography>

      <Button
        variant="outlined"
        className="create"
        component={Link}
        to="/networks/create"
      >
        <Add />
        {formatMessage({ id: 'editorCreateNetworkHeaderText' })}
      </Button>

      <Loading
        text={formatMessage({ id: 'networksLoadingNetworksText' })}
        isLoading={!networks || !organisations}
      >
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {formatMessage({ id: 'networksNameTableHeaderLabel' })}
                </TableCell>
                <TableCell>
                  {formatMessage({ id: 'networksPrivateCodeTableHeaderLabel' })}
                </TableCell>
                <TableCell>
                  {formatMessage({ id: 'networksAuthorityTableHeaderLabel' })}
                </TableCell>
                <TableCell>{''}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <RenderTableRows
                networkList={networks!}
                organisationList={organisations!}
              />
            </TableBody>
          </Table>
          {showDeleteDialogue && selectedNetwork && (
            <ConfirmDialog
              isOpen
              onDismiss={() => {
                setSelectedNetwork(undefined);
                setShowDeleteDialogue(false);
              }}
              title={formatMessage({
                id: 'editorDeleteNetworkConfirmationDialogTitle',
              })}
              message={formatMessage({
                id: 'editorDeleteNetworkConfirmationDialogMessage',
              })}
              buttons={[
                <Button
                  variant="outlined"
                  key="no"
                  onClick={() => {
                    setSelectedNetwork(undefined);
                    setShowDeleteDialogue(false);
                  }}
                >
                  {formatMessage({ id: 'no' })}
                </Button>,
                <Button
                  variant="contained"
                  color="success"
                  key="yes"
                  onClick={() => {
                    dispatch(deleteNetworkById(selectedNetwork?.id, intl))
                      .then(() => {
                        setSelectedNetwork(undefined);
                        setShowDeleteDialogue(false);
                      })
                      .then(() => dispatch(loadNetworks(intl)));
                  }}
                >
                  {formatMessage({ id: 'yes' })}
                </Button>,
              ]}
            />
          )}
        </>
      </Loading>
    </div>
  );
};

export default Networks;
