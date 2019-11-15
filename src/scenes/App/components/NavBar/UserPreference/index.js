import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DropDown, DropDownOptions } from '@entur/component-library';

import UserMenu from './UserMenu/';
import { setActiveProvider } from 'actions/providers';

import './styles.css';

class UserPreference extends React.Component {
  handleActiveProviderChange(provider) {
    const { dispatch, history } = this.props;
    dispatch(setActiveProvider(provider));
    history.replace('/');
  }

  render() {
    const { providers, activeProvider } = this.props;

    return (
      <div className="user-preference">
        <UserMenu />

        {providers && (
          <DropDown
            className="provider-select"
            value={activeProvider || ''}
            onChange={e => this.handleActiveProviderChange(e.target.value)}
            variant="midnight"
          >
            {providers.map(p => (
              <DropDownOptions key={p.code} label={p.name} value={p.code} />
            ))}
          </DropDown>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ providers }) => ({
  providers: providers.providers,
  activeProvider: providers.active
});

export default compose(
  withRouter,
  connect(mapStateToProps)
)(UserPreference);
