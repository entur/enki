import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Heading1 } from '@entur/typography';
import { deleteNetworkById, loadNetworks } from 'actions/networks';
import { selectIntl } from 'i18n';
import './styles.scss';
import { GlobalState } from 'reducers';
import { Network } from 'model/Network';
import { AddIcon } from '@entur/icons';
import { SecondaryButton, SuccessButton } from '@entur/button';
import ConfirmDialog from '../../components/ConfirmDialog';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import { Organisation } from 'model/Organisation';

const Networks = () => {
  const navigate = useNavigate();
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(
    undefined
  );
  const { formatMessage } = useSelector(selectIntl);
  const { providers, organisations, networks } = useSelector<
    GlobalState,
    GlobalState
  >((s) => s);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadNetworks());
  }, [dispatch, providers.active]);

  const handleOnRowClick = useCallback(
    (id: string) => {
      navigate(`/networks/edit/${id}`);
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
          onClick={() => handleOnRowClick(n.id!)}
          title={n.description}
        >
          <DataCell>{n.name}</DataCell>
          <DataCell>{n.privateCode}</DataCell>
          <DataCell>
            {organisationList.find((o) => o.id === n.authorityRef)?.name
              ?.value ?? '-'}
          </DataCell>
          <DataCell className="delete-row-cell">
            <DeleteButton
              onClick={() => {
                setSelectedNetwork(n);
                setShowDeleteDialogue(true);
              }}
              title=""
              thin
            />
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
      <Heading1>{formatMessage('networksHeaderText')}</Heading1>

      <SecondaryButton className="create" as={Link} to="/networks/create">
        <AddIcon />
        {formatMessage('editorCreateNetworkHeaderText')}
      </SecondaryButton>

      <Loading
        text={formatMessage('networksLoadingNetworksText')}
        isLoading={!networks || !organisations}
      >
        <>
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
                <HeaderCell>{''}</HeaderCell>
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
              title={formatMessage(
                'editorDeleteNetworkConfirmationDialogTitle'
              )}
              message={formatMessage(
                'editorDeleteNetworkConfirmationDialogMessage'
              )}
              buttons={[
                <SecondaryButton
                  key="no"
                  onClick={() => {
                    setSelectedNetwork(undefined);
                    setShowDeleteDialogue(false);
                  }}
                >
                  {formatMessage('no')}
                </SecondaryButton>,
                <SuccessButton
                  key="yes"
                  onClick={() => {
                    dispatch(deleteNetworkById(selectedNetwork?.id))
                      .then(() => {
                        setSelectedNetwork(undefined);
                        setShowDeleteDialogue(false);
                      })
                      .then(() => dispatch(loadNetworks()));
                  }}
                >
                  {formatMessage('yes')}
                </SuccessButton>,
              ]}
            />
          )}
        </>
      </Loading>
    </div>
  );
};

export default Networks;
