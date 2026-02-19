import { Autocomplete, Box, TextField } from '@mui/material';
import {
  NormalizedDropdownItemType,
  mapVehicleSubmodeAndLabelToItems,
} from 'helpers/dropdown';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import {
  VEHICLE_MODE,
  VEHICLE_SUBMODE,
  VEHICLE_SUBMODE_LINK,
} from 'model/enums';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

type Props = {
  transportMode: VEHICLE_MODE;
  transportSubmode: VEHICLE_SUBMODE | undefined;
  submodeChange: (submode: VEHICLE_SUBMODE) => void;
  spoilPristine: boolean;
};

const VehicleSubModeDropdown = (props: Props) => {
  const { formatMessage } = useIntl();
  const submodePristine = usePristine(
    props.transportSubmode,
    props.spoilPristine,
  );
  const getSubModeItems = useCallback(
    () =>
      props.transportMode
        ? mapVehicleSubmodeAndLabelToItems(
            VEHICLE_SUBMODE_LINK[props.transportMode],
            formatMessage,
          )
        : [],
    [props.transportMode, formatMessage],
  );

  const items = getSubModeItems();

  return (
    <Box key={props.transportMode}>
      <Autocomplete
        value={
          items.find((item) => item.value === props.transportSubmode) || null
        }
        options={items}
        getOptionLabel={(option: NormalizedDropdownItemType) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(_e, element) =>
          props.submodeChange(element?.value as VEHICLE_SUBMODE)
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={formatMessage({ id: 'transportSubModeTitle' })}
            placeholder={formatMessage({ id: 'defaultOption' })}
            {...getMuiErrorProps(
              formatMessage({ id: 'transportSubModeEmpty' }),
              !isBlank(props.transportSubmode),
              submodePristine,
            )}
          />
        )}
      />
    </Box>
  );
};

export default VehicleSubModeDropdown;
