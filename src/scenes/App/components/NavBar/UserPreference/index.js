import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown } from '@entur/dropdown';
import { Contrast } from '@entur/layout';

import UserMenu from './UserMenu/';
import { setActiveProvider } from 'actions/providers';
import '@entur/dropdown/dist/styles.css';
import '@entur/layout/dist/styles.css';
import '@entur/form/dist/styles.css';
import './styles.css';

class UserPreference extends React.Component {
  handleActiveProviderChange(provider) {
    const { dispatch, history } = this.props;
    dispatch(setActiveProvider(provider));
    history.replace('/');
  }

  render() {
    const { providers, activeProvider } = this.props;

    const items = providers
      ? providers.map(p => ({
          value: p.code,
          label: p.name
        }))
      : [];

    return (
      <div className="user-preference">
        <UserMenu />
        {providers && (
          <Contrast>
            <div className="provider-wrapper">
              <Dropdown
                items={items}
                label="Velg dataleverandør"
                value={activeProvider || ''}
                onChange={e => this.handleActiveProviderChange(e.value)}
              />
            </div>
          </Contrast>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ providers }) => ({
  providers: providers.providers,
  activeProvider: providers.active
});

export default compose(withRouter, connect(mapStateToProps))(UserPreference);
