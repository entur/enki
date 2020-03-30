import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown } from '@entur/dropdown';
import { Contrast } from '@entur/layout';
import { AppIntlState, selectIntl } from 'i18n';
import UserMenu from './UserMenu/';
import { setActiveProvider } from 'actions/providers';
import { GlobalState } from 'reducers';
import { ProvidersState } from 'reducers/providers';
import { RouteComponentProps } from 'react-router';
import Provider from 'model/Provider';
import './styles.scss';

const UserPreference = ({ history }: RouteComponentProps) => {
  const { providers, active } = useSelector<GlobalState, ProvidersState>(
    (state) => state.providers
  );
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  const dispatch = useDispatch();

  const handleActiveProviderChange = (provider: Provider) => {
    dispatch(setActiveProvider(provider));
    history.replace('/');
  };

  const items = providers
    ? providers.map((p) => ({
        value: p.code ?? '',
        label: p.name ?? '',
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
            label={formatMessage('navBarDataProvider')}
            value={active ?? ''}
            onChange={(e) => handleActiveProviderChange(e?.value as Provider)}
          />
        </Contrast>
      )}
    </div>
  );
};

export default withRouter(UserPreference);
