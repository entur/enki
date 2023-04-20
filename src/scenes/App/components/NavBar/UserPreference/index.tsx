import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from '@entur/dropdown';
import { Contrast } from '@entur/layout';
import { useIntl } from 'react-intl';
import UserMenu from './UserMenu/';
import { setActiveProvider } from 'actions/providers';
import { GlobalState } from 'reducers';
import { ProvidersState } from 'reducers/providers';
import './styles.scss';
import { sortProviders } from 'model/Provider';
import { useNavigate } from 'react-router-dom';

const UserPreference = () => {
  const navigate = useNavigate();
  const { providers, active } = useSelector<GlobalState, ProvidersState>(
    (state) => state.providers
  );
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const handleActiveProviderChange = (providerCode: string | undefined) => {
    const provider = providers?.find((p) => p.code === providerCode);
    if (provider) {
      window.localStorage.setItem('ACTIVE_PROVIDER', provider.code!);
      dispatch(setActiveProvider(provider));
      navigate('/', { replace: true });
    }
  };

  const items = providers
    ? providers
        .slice()
        .sort(sortProviders)
        .map((p) => ({
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
            items={() => items}
            label={formatMessage({ id: 'navBarDataProvider' })}
            value={active?.code}
            onChange={(e) => handleActiveProviderChange(e?.value)}
          />
        </Contrast>
      )}
    </div>
  );
};

export default UserPreference;
