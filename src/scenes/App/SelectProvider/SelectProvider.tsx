import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useIntl } from 'react-intl';
import {
  setActiveProviderCode,
  ACTIVE_PROVIDER,
} from '../../../auth/userContextSlice';
import { sortProviders } from '../../../model/Provider';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

type ProviderOption = {
  value: string;
  label: string;
};

export const SelectProvider = () => {
  const navigate = useNavigate();
  const { providers, activeProviderCode } = useAppSelector(
    (state) => state.userContext,
  );
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const handleActiveProviderChange = (providerCode: string | undefined) => {
    const provider = providers?.find((p) => p.code === providerCode);
    if (provider) {
      window.localStorage.setItem(ACTIVE_PROVIDER, provider.code!);
      dispatch(setActiveProviderCode(provider.code));
      navigate('/', { replace: true });
    }
  };

  const active = providers?.find(({ code }) => code === activeProviderCode);

  const items: ProviderOption[] = providers
    ? providers
        .slice()
        .sort(sortProviders)
        .map((p) => ({
          value: p.code ?? '',
          label: p.name ?? '',
        }))
    : [];

  const selectedItem =
    items.find((item) => item.value === active?.code) ?? null;

  return (
    <>
      {providers && (
        <Autocomplete
          options={items}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          value={selectedItem}
          onChange={(_event, newValue) =>
            handleActiveProviderChange(newValue?.value)
          }
          noOptionsText={formatMessage({
            id: 'dropdownNoMatchesText',
          })}
          renderInput={(params) => (
            <TextField
              {...params}
              label={formatMessage({ id: 'navBarDataProvider' })}
            />
          )}
        />
      )}
    </>
  );
};
