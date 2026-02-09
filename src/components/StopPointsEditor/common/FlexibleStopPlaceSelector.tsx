import { Autocomplete, TextField } from '@mui/material';
import { NormalizedDropdownItemType, mapToItems } from 'helpers/dropdown';
import usePristine from 'hooks/usePristine';
import { MessagesKey } from 'i18n/translationKeys';
import { useIntl } from 'react-intl';
import { useAppSelector } from '../../../store/hooks';
import StopPoint from '../../../model/StopPoint';

interface FlexibleStopPlaceSelectorProps {
  stopPoint: StopPoint;
  spoilPristine: boolean;
  stopPlaceError: keyof MessagesKey | undefined;
  onChange: (stopPoint: StopPoint) => void;
}

export const FlexibleStopPlaceSelector = ({
  stopPoint,
  spoilPristine,
  stopPlaceError,
  onChange,
}: FlexibleStopPlaceSelectorProps) => {
  const { formatMessage } = useIntl();
  const flexibleStopPlaces = useAppSelector(
    (state) => state.flexibleStopPlaces,
  );
  const stopPlacePristine = usePristine(
    stopPoint.flexibleStopPlaceRef,
    spoilPristine,
  );

  return (
    <Autocomplete
      sx={{ flex: 1, minWidth: 200 }}
      value={
        mapToItems(flexibleStopPlaces || []).find(
          (item) => item.value === stopPoint.flexibleStopPlaceRef,
        ) || null
      }
      onChange={(_event, newValue: NormalizedDropdownItemType | null) =>
        onChange({
          ...stopPoint,
          flexibleStopPlaceRef: newValue?.value,
        })
      }
      options={mapToItems(flexibleStopPlaces || [])}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      noOptionsText={formatMessage({
        id: 'dropdownNoMatchesText',
      })}
      renderInput={(params) => {
        const hasError = !stopPlacePristine && !!stopPlaceError;
        return (
          <TextField
            {...params}
            label={formatMessage({ id: 'stopPlace' })}
            placeholder={formatMessage({ id: 'defaultOption' })}
            error={hasError}
            helperText={hasError ? formatMessage({ id: stopPlaceError }) : ''}
          />
        );
      }}
    />
  );
};
