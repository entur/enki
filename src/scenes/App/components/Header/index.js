import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DropDown, DropDownOptions } from '@entur/component-library';

import { setActiveProvider } from '../../../../actions/providers';

import logo from '../../../../static/img/logo.png';
import './styles.css';

class Header extends Component {
  handleActiveProviderChange(provider) {
    this.props.dispatch(setActiveProvider(provider));
  }

  render() {
    const { providers, activeProvider } = this.props;

    return (
      <div className="header">
        {providers && <div />}

        <div className="logo-and-title">
          <img src={logo} alt="Logo for Entur Bestillingstransport" />
          <div className="title">Bestillingstransport</div>
        </div>

        {providers && (
          <DropDown
            className="provider-select"
            value={activeProvider || ''}
            onChange={e => this.handleActiveProviderChange(e.target.value)}
            size="sm"
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

export default connect(mapStateToProps)(Header);
