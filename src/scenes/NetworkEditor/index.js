import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions
} from '@entur/component-library';

import { Network } from '../../model';
import { getOrganisations } from '../../actions/organisations';
import { saveNetwork } from '../../actions/networks';
import Loading from '../../components/Loading';

import './styles.css';

const DEFAULT_AUTHORITY_LABEL = '--- velg ---';
const DEFAULT_AUTHORITY_VALUE = '-1';

class NetworkEditor extends Component {
  state = {
    network: new Network(),
    authoritySelection: DEFAULT_AUTHORITY_VALUE
  };

  componentDidMount() {
    this.props.dispatch(getOrganisations());
  }

  handleFieldChange(field, value) {
    this.setState(({ network }) => ({
      network: network.withChanges({ [field]: value })
    }));
  }

  handleAuthoritySelectionChange(authoritySelection) {
    const authorityRef =
      authoritySelection !== DEFAULT_AUTHORITY_VALUE
        ? authoritySelection
        : null;
    this.setState(({ network }) => ({
      network: network.withChanges({ authorityRef })
    }));
    this.setState({ authoritySelection });
  }

  handleOnSaveClick() {
    this.props.dispatch(saveNetwork(this.state.network));
  }

  render() {
    const { organisations = [] } = this.props;
    const { authoritySelection } = this.state;
    const { name, description, privateCode } = this.state.network;

    const authorities = organisations.filter(org =>
      org.types.includes('Authority')
    );

    return (
      <div className="network-editor">
        <Loading
          className="authority-loader"
          text="Laster inn autoriteter..."
          isLoading={!this.props.organisations}
        >
          <h3>Opprett nettverk</h3>

          <div className="network-form">
            <Label>Navn</Label>
            <TextField
              type="text"
              value={name}
              onChange={e => this.handleFieldChange('name', e.target.value)}
            />

            <Label>Beskrivelse</Label>
            <TextArea
              type="text"
              value={description}
              onChange={e =>
                this.handleFieldChange('description', e.target.value)
              }
            />

            <Label>Privat kode</Label>
            <TextField
              type="text"
              value={privateCode}
              onChange={e =>
                this.handleFieldChange('privateCode', e.target.value)
              }
            />

            <Label>Autoritet</Label>
            <DropDown
              value={authoritySelection}
              onChange={e =>
                this.handleAuthoritySelectionChange(e.target.value)
              }
            >
              <DropDownOptions
                label={DEFAULT_AUTHORITY_LABEL}
                value={DEFAULT_AUTHORITY_VALUE}
              />
              {authorities.map(org => (
                <DropDownOptions key={org.id} label={org.name} value={org.id} />
              ))}
            </DropDown>

            <div className="save-button-container">
              <Button variant="success" onClick={::this.handleOnSaveClick}>
                Lagre
              </Button>
            </div>
          </div>
        </Loading>
      </div>
    );
  }
}

const mapStateToProps = ({ organisations }) => ({
  organisations: organisations.organisations
});

export default connect(mapStateToProps)(NetworkEditor);
