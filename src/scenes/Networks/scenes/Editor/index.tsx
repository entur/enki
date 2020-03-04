import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { InputGroup, TextArea, TextField } from '@entur/form';
import { Dropdown } from '@entur/dropdown';
import { SuccessButton, NegativeButton, SecondaryButton } from '@entur/button';
import { Network } from 'model';
import { isBlank } from 'helpers/forms';
import { ORGANISATION_TYPE } from 'model/enums';
import {
  deleteNetworkById,
  loadNetworkById,
  saveNetwork
} from 'actions/networks';
import { loadFlexibleLines } from 'actions/flexibleLines';
import OverlayLoader from 'components/OverlayLoader';
import Loading from 'components/Loading';
import ConfirmDialog from 'components/ConfirmDialog';
import PageHeader from 'components/PageHeader';

import './styles.scss';
import { createSelector } from 'reselect';
import selectActiveProvider from 'selectors/selectActiveProvider';
import { selectIntl } from 'i18n';
import messages from './messages';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

const selectNetwork = createSelector(
  state => state.networks,
  (_, match) => match.params.id,
  (networks, id) =>
    id ? (networks ? networks.find(n => n.id === id) : null) : new Network()
);

const NetworkEditor = ({ match, history }) => {
  const { formatMessage } = useSelector(selectIntl);
  const activeProvider = useSelector(selectActiveProvider());
  const organisations = useSelector(({ organisations }) => organisations);
  const lines = useSelector(({ flexibleLines }) => flexibleLines);
  const currentNetwork = useSelector(state => selectNetwork(state, match));

  const [authoritySelection, setAuthoritySelection] = useState(
    currentNetwork?.authorityRef || DEFAULT_SELECT_VALUE
  );
  const [isSaving, setSaving] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [network, setNetwork] = useState(currentNetwork);

  const dispatch = useDispatch();

  const dispatchLoadFlexibleLines = useCallback(
    () => dispatch(loadFlexibleLines()),
    [dispatch]
  );

  const dispatchLoadNetwork = useCallback(() => {
    if (match.params.id) {
      dispatch(loadNetworkById(match.params.id)).catch(() =>
        history.push('/networks')
      );
    }
  }, [dispatch, match.params.id, history]);

  useEffect(() => {
    dispatchLoadFlexibleLines();
    dispatchLoadNetwork();
  }, [dispatchLoadFlexibleLines, dispatchLoadNetwork]);

  useEffect(() => {
    setAuthoritySelection(
      currentNetwork ? currentNetwork.authorityRef : DEFAULT_SELECT_VALUE
    );
    setNetwork(currentNetwork);
  }, [currentNetwork]);

  const handleOnSaveClick = () => {
    setSaving(true);
    dispatch(saveNetwork(network))
      .then(() => history.push('/networks'))
      .finally(() => setSaving(false));
  };

  const onFieldChange = (field, value) => {
    setNetwork(network.withFieldChange(field, value));
  };

  const handleAuthoritySelectionChange = authoritySelection => {
    const authorityRef =
      authoritySelection !== DEFAULT_SELECT_VALUE ? authoritySelection : null;
    setNetwork(network.withFieldChange('authorityRef', authorityRef));
    setAuthoritySelection(authoritySelection);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteNetworkById(network.id)).then(() =>
      history.push('/networks')
    );
  };

  const authorities = organisations.filter(
    org =>
      org.types.includes(ORGANISATION_TYPE.AUTHORITY) &&
      org.references.netexAuthorityId &&
      org.references.codeSpace === activeProvider.codespace.xmlns
  );

  const isDeleteDisabled =
    !network ||
    !lines ||
    !!lines.find(l => l.networkRef === network.id) ||
    isDeleting;

  const isSaveDisabled = !network || !network.name || !network.authorityRef;

  return (
    <div className="network-editor">
      <div className="header">
        <PageHeader
          withBackButton
          title={
            match.params.id
              ? formatMessage(messages.editNetworkHeaderText)
              : formatMessage(messages.createNetworkHeaderText)
          }
        />
      </div>

      {network && lines ? (
        <OverlayLoader
          isLoading={isSaving || isDeleting}
          text={
            isSaving
              ? formatMessage(messages.savingNetworkLoadingText)
              : formatMessage(messages.deletingNetworkLoadingText)
          }
        >
          <div className="network-form">
            <InputGroup
              className="form-section"
              label={formatMessage(messages.nameLabelText)}
              variant={isBlank(network.name) ? 'error' : undefined}
              feedback={
                isBlank(network.name) ? 'Navn må fylles inn.' : undefined
              }
            >
              <TextField
                defaultValue={network.name ?? ''}
                onChange={e => onFieldChange('name', e.target.value)}
              />
            </InputGroup>

            <InputGroup
              className="form-section"
              label={formatMessage(messages.descriptionLabelText)}
            >
              <TextArea
                value={network.description ?? ''}
                onChange={e => onFieldChange('description', e.target.value)}
              />
            </InputGroup>

            <InputGroup
              className="form-section"
              label={formatMessage(messages.privateCodeLabelText)}
            >
              <TextField
                value={network.privateCode ?? ''}
                onChange={e => onFieldChange('privateCode', e.target.value)}
              />
            </InputGroup>

            <Dropdown
              className="form-section"
              label={formatMessage(messages.authorityLabelText)}
              items={[
                { value: DEFAULT_SELECT_VALUE, label: DEFAULT_SELECT_LABEL },
                ...authorities.map(org => ({
                  label: org.name,
                  value: org.id
                }))
              ]}
              value={authoritySelection}
              onChange={({ value }) => handleAuthoritySelectionChange(value)}
            />

            <div className="buttons">
              {match.params.id && (
                <NegativeButton
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isDeleteDisabled}
                >
                  {formatMessage(messages.deleteButtonText)}
                </NegativeButton>
              )}

              <SuccessButton
                onClick={handleOnSaveClick}
                disabled={isSaveDisabled}
              >
                {formatMessage(messages.saveButtonText)}
              </SuccessButton>
            </div>
          </div>
        </OverlayLoader>
      ) : (
        <Loading
          text={
            !network
              ? formatMessage(messages.loadingNetworkText)
              : formatMessage(messages.loadingDependenciesText)
          }
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage(messages.deleteNetworkConfirmDialogTitle)}
        message={formatMessage(messages.deleteNetworkConfirmDialogMessage)}
        buttons={[
          <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage(messages.deleteNetworkConfirmDialogCancelText)}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={handleDelete}>
            {formatMessage(messages.deleteNetworkConfirmDialogConfirmText)}
          </SuccessButton>
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(NetworkEditor);
