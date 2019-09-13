import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions
} from '@entur/component-library';

import { Network } from '../../../../model';
import { ORGANISATION_TYPE } from '../../../../model/enums';
import {
  deleteNetworkById,
  loadNetworkById,
  saveNetwork
} from '../../../../actions/networks';
import { loadFlexibleLines } from '../../../../actions/flexibleLines';
import OverlayLoader from '../../../../components/OverlayLoader';
import Loading from '../../../../components/Loading';
import ConfirmDialog from '../../../../components/ConfirmDialog';

import './styles.css';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

const NetworkEditor = ({ dispatch, match, history, lines, network: currentNetwork, organisations }) => {
  const [authoritySelection, setAuthoritySelection] = useState(DEFAULT_SELECT_VALUE);
  const [isSaving, setSaving] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [network, setNetwork] = useState(currentNetwork);

  useEffect(() => {
    dispatch(loadFlexibleLines());
    if (match.params.id) {
      dispatch(loadNetworkById(match.params.id));
    }
  }, []);

  useEffect(() => {
    setAuthoritySelection(currentNetwork ? currentNetwork.authorityRef : DEFAULT_SELECT_VALUE);
    setNetwork(currentNetwork);
  }, [currentNetwork]);

  const handleOnSaveClick = () => {
    setSaving(true);
    dispatch(saveNetwork(network))
      .then(() => history.push('/networks'));
  };

  const handleFieldChange = (field, value) => {
    setNetwork(network.withChanges({ [field]: value }));
  };

  const handleAuthoritySelectionChange = (authoritySelection) => {
    const authorityRef =
      authoritySelection !== DEFAULT_SELECT_VALUE ? authoritySelection : null;
    setNetwork(network.withChanges({ authorityRef}));
    setAuthoritySelection(authoritySelection);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteNetworkById(network.id))
      .then(() => history.push('/networks'));
  };

  const authorities = organisations.filter(org =>
    org.types.includes(ORGANISATION_TYPE.AUTHORITY) &&
    org.references.netexAuthorityId
  );

  const isDeleteDisabled =
    !network ||
    !lines ||
    !!lines.find(l => l.networkRef === network.id) ||
    isDeleting;

  const isSaveDisabled =
    !network ||
    !network.name ||
    !network.authorityRef;

  return (
    <div className="network-editor">
      <div className="header">
        <h2>{match.params.id ? 'Rediger' : 'Opprett'} nettverk</h2>

        <div className="buttons">
          <Button
            variant="success"
            onClick={handleOnSaveClick}
            disabled={isSaveDisabled}>
            Lagre
          </Button>

          {match.params.id && (
            <Button
              variant="negative"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleteDisabled}
            >
              Slett
            </Button>
          )}
        </div>
      </div>

      {network && lines ? (
        <OverlayLoader
          isLoading={isSaving || isDeleting}
          text={(isSaving ? 'Lagrer' : 'Sletter') + ' nettverket...'}
        >
          <div className="network-form">
            <Label>* Navn</Label>
            <TextField
              type="text"
              value={network.name}
              onChange={e => handleFieldChange('name', e.target.value)}
            />

            <Label>Beskrivelse</Label>
            <TextArea
              type="text"
              value={network.description}
              onChange={e =>
                handleFieldChange('description', e.target.value)
              }
            />

            <Label>Privat kode</Label>
            <TextField
              type="text"
              value={network.privateCode}
              onChange={e =>
                handleFieldChange('privateCode', e.target.value)
              }
            />

            <Label>* Autoritet</Label>
            <DropDown
              value={authoritySelection}
              onChange={e =>
                handleAuthoritySelectionChange(e.target.value)
              }
            >
              <DropDownOptions
                label={DEFAULT_SELECT_LABEL}
                value={DEFAULT_SELECT_VALUE}
              />
              {authorities.map(org => (
                <DropDownOptions
                  key={org.id}
                  label={org.name}
                  value={org.id}
                />
              ))}
            </DropDown>
          </div>
        </OverlayLoader>
      ) : (
        <Loading
          text={`Laster inn ${!network ? 'nettverket' : 'avhengigheter'}...`}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Slette nettverk"
        message="Er du sikker på at du ønsker å slette dette nettverket?"
        buttons={[
          <Button
            key={2}
            onClick={() => setDeleteDialogOpen(false)}
            variant="secondary"
            width="md"
            className="action-button"
          >
            Nei
          </Button>,
          <Button
            key={1}
            onClick={handleDelete}
            variant="success"
            width="md"
            className="action-button"
          >
            Ja
          </Button>
        ]}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}

const mapStateToProps = ({ organisations, flexibleLines, networks }, ownProps) => ({
  network: ownProps.match.params.id ? networks ? networks.find(n => n.id === ownProps.match.params.id) : null : new Network(),
  organisations,
  lines: flexibleLines
});

export default compose(withRouter, connect(mapStateToProps))(NetworkEditor);
