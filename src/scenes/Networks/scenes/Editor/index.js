import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions
} from '@entur/component-library';

import { Network } from 'model';
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
    DEFAULT_SELECT_VALUE
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
        <h2>
          {match.params.id
            ? formatMessage(messages.editNetworkHeaderText)
            : formatMessage(messages.createNetworkHeaderText)}
        </h2>

        <div className="buttons">
          <Button
            variant="success"
            onClick={handleOnSaveClick}
            disabled={isSaveDisabled}
          >
            {formatMessage(messages.saveButtonText)}
          </Button>

          {match.params.id && (
            <Button
              variant="negative"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleteDisabled}
            >
              {formatMessage(messages.deleteButtonText)}
            </Button>
          )}
        </div>
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
            <Label>{formatMessage(messages.nameLabelText)}</Label>
            <TextField
              type="text"
              value={network.name}
              onChange={e => onFieldChange('name', e.target.value)}
            />

            <Label>{formatMessage(messages.descriptionLabelText)}</Label>
            <TextArea
              type="text"
              value={network.description}
              onChange={e => onFieldChange('description', e.target.value)}
            />

            <Label>{formatMessage(messages.privateCodeLabelText)}</Label>
            <TextField
              type="text"
              value={network.privateCode}
              onChange={e => onFieldChange('privateCode', e.target.value)}
            />

            <Label>{formatMessage(messages.authorityLabelText)}</Label>
            <DropDown
              value={authoritySelection}
              onChange={e => handleAuthoritySelectionChange(e.target.value)}
            >
              <DropDownOptions
                label={DEFAULT_SELECT_LABEL}
                value={DEFAULT_SELECT_VALUE}
              />
              {authorities.map(org => (
                <DropDownOptions key={org.id} label={org.name} value={org.id} />
              ))}
            </DropDown>
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
          <Button
            key={2}
            onClick={() => setDeleteDialogOpen(false)}
            variant="secondary"
            width="md"
            className="action-button"
          >
            {formatMessage(messages.deleteNetworkConfirmDialogCancelText)}
          </Button>,
          <Button
            key={1}
            onClick={handleDelete}
            variant="success"
            width="md"
            className="action-button"
          >
            {formatMessage(messages.deleteNetworkConfirmDialogConfirmText)}
          </Button>
        ]}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(NetworkEditor);
