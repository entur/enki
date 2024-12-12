import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { setActiveProviderCode } from '../../../auth/userContextSlice';
import { sortProviders } from '../../../model/Provider';
import { Dropdown } from '@entur/dropdown';

export const SelectProvider = () => {
  const navigate = useNavigate();
  const { providers, activeProviderCode } = useAppSelector(
    (state) => state.userContext,
  );
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const handleActiveProviderChange = (providerCode: string | undefined) => {
    const provider = providers?.find((p) => p.code === providerCode);
    if (provider) {
      window.localStorage.setItem('ACTIVE_PROVIDER', provider.code!);
      dispatch(setActiveProviderCode(provider.code));
      navigate('/', { replace: true });
    }
  };

  const active = providers?.find(({ code }) => code === activeProviderCode);

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
    <>
      {providers && (
        <Dropdown
          className="provider-wrapper"
          items={() => items}
          label={formatMessage({ id: 'navBarDataProvider' })}
          selectedItem={{
            value: active?.code,
            label: active?.name ?? '',
          }}
          onChange={(e) => handleActiveProviderChange(e?.value)}
          noMatchesText={formatMessage({
            id: 'dropdownNoMatchesText',
          })}
        />
      )}
    </>
  );
};
