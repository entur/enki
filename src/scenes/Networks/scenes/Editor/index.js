import React, { Component } from 'react';
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

import { Network } from '../../../../model/index';
import { ORGANISATION_TYPE } from '../../../../model/enums';
import { loadNetworkById, saveNetwork } from '../../../../actions/networks';
import OverlayLoader from '../../../../components/OverlayLoader';
import Loading from '../../../../components/Loading';

import './styles.css';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

class NetworkEditor extends Component {
  state = {
    network: null,
    authoritySelection: DEFAULT_SELECT_VALUE,
    isSaving: false
  };

  componentDidMount() {
    const { dispatch, match, history } = this.props;
    if (match.params.id) {
      dispatch(loadNetworkById(match.params.id))
        .then(network =>
          this.setState({
            network,
            authoritySelection: network.authorityRef
          })
        )
        .catch(() => history.push('/networks'));
    } else {
      this.setState({ network: new Network() });
    }
  }

  handleFieldChange(field, value) {
    this.setState(({ network }) => ({
      network: network.withChanges({ [field]: value })
    }));
  }

  handleAuthoritySelectionChange(authoritySelection) {
    const authorityRef =
      authoritySelection !== DEFAULT_SELECT_VALUE ? authoritySelection : null;
    this.setState(({ network }) => ({
      network: network.withChanges({ authorityRef })
    }));
    this.setState({ authoritySelection });
  }

  handleOnSaveClick() {
    const { dispatch, history } = this.props;
    this.setState({ isSaving: true });
    dispatch(saveNetwork(this.state.network))
      .then(() => history.push('/networks'))
      .finally(() => this.setState({ isSaving: false }));
  }

  render() {
    const { authoritySelection, isSaving, network } = this.state;
    const { match } = this.props;

    const authorities = this.props.organisations.filter(org =>
      org.types.includes(ORGANISATION_TYPE.AUTHORITY)
    );

    return (
      <div className="network-editor">
        <h2>{match.params.id ? 'Rediger' : 'Opprett'} nettverk</h2>

        {network ? (
          <OverlayLoader isLoading={isSaving} text="Lagrer nettverk...">
            <div className="network-form">
              <Label>Navn</Label>
              <TextField
                type="text"
                value={network.name}
                onChange={e => this.handleFieldChange('name', e.target.value)}
              />

              <Label>Beskrivelse</Label>
              <TextArea
                type="text"
                value={network.description}
                onChange={e =>
                  this.handleFieldChange('description', e.target.value)
                }
              />

              <Label>Privat kode</Label>
              <TextField
                type="text"
                value={network.privateCode}
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

              <div className="save-button-container">
                <Button variant="success" onClick={::this.handleOnSaveClick}>
                  Lagre
                </Button>
              </div>
            </div>
          </OverlayLoader>
        ) : (
          <Loading text="Laster inn nettverket..." />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ organisations }) => ({ organisations });

export default compose(withRouter, connect(mapStateToProps))(NetworkEditor);
