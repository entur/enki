import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown } from '@entur/dropdown';
import { Contrast } from '@entur/layout';
import { getIntl } from 'i18n';

import UserMenu from './UserMenu/';
import { setActiveProvider } from 'actions/providers';
import messages from '../messages';
import './styles.scss';

class UserPreference extends React.Component {
  handleActiveProviderChange(provider) {
    const { dispatch, history } = this.props;
    dispatch(setActiveProvider(provider));
    history.replace('/');
  }

  render() {
    const { providers, activeProvider, intl } = this.props;
    const translations = getIntl({ intl });

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
            <Dropdown
              className="provider-wrapper"
              items={items}
              label={translations.formatMessage(messages.dataProvider)}
              value={activeProvider || ''}
              onChange={e => this.handleActiveProviderChange(e.value)}
            />
          </Contrast>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ intl, providers }) => ({
  providers: providers.providers,
  activeProvider: providers.active,
  intl: intl
});

export default compose(withRouter, connect(mapStateToProps))(UserPreference);
