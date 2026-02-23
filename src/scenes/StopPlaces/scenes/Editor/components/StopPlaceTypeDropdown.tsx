import { Autocomplete, TextField } from '@mui/material';
import { KeyValues } from 'model/KeyValues';
import {
  FLEXIBLE_STOP_AREA_TYPE,
  flexibleStopAreaTypeMessages,
} from 'model/enums';
import { useIntl } from 'react-intl';

export interface Props {
  label: string;
  keyValues: KeyValues[] | undefined;
  keyValuesUpdate: (keyValues: KeyValues[]) => void;
}

export const StopPlaceTypeDropdown = ({
  label,
  keyValues,
  keyValuesUpdate,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Autocomplete
      fullWidth
      value={
        keyValues?.find((v) => v.key === 'FlexibleStopAreaType')?.values[0]
          ? {
              value:
                keyValues?.find((v) => v.key === 'FlexibleStopAreaType')
                  ?.values[0] || '',
              label: formatMessage({
                id: flexibleStopAreaTypeMessages[
                  keyValues?.find((v) => v.key === 'FlexibleStopAreaType')
                    ?.values[0]! as FLEXIBLE_STOP_AREA_TYPE
                ],
              }),
            }
          : null
      }
      onChange={(_event, selectedItem) => {
        if (selectedItem) {
          keyValuesUpdate([
            {
              key: 'FlexibleStopAreaType',
              values: [selectedItem.value],
            },
          ]);
        } else {
          keyValuesUpdate([]);
        }
      }}
      options={Object.values(FLEXIBLE_STOP_AREA_TYPE).map((v) => ({
        value: v,
        label: formatMessage({
          id: flexibleStopAreaTypeMessages[v],
        }),
      }))}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
};
