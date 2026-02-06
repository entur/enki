import DarkMode from '@mui/icons-material/DarkMode';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import { useIntl } from 'react-intl';

type Props = {
  value?: number;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
};

type OptionType = {
  value: string;
  label: string;
};

const options: OptionType[] = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
].map((v) => ({ value: v, label: v }));

export default ({ value, onChange, disabled = false }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Autocomplete
      disabled={disabled}
      style={{ minWidth: '120px' }}
      options={options}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      value={
        options.find((o) => o.value === (value?.toString() ?? '0')) ||
        options[0]
      }
      onChange={(_event, newValue) =>
        onChange(parseInt(newValue?.value || '0'))
      }
      disableClearable
      renderInput={(params) => (
        <TextField
          {...params}
          label={formatMessage({ id: 'passingTimesDayOffset' })}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <DarkMode fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};
