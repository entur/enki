import { Autocomplete, TextField } from '@mui/material';
import { NormalizedDropdownItemType } from 'helpers/dropdown';
import { MessagesKey } from 'i18n/translationKeys';
import StopPoint from 'model/StopPoint';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

enum BoardingType {
  BOARDING = '0',
  ALIGHTING = '1',
  BOARDING_AND_ALIGHTING = '2',
}

export const useSelectedBoardingType = (stopPoint: StopPoint) => {
  const selectedBoardingType = useMemo((): BoardingType | undefined => {
    if (stopPoint.forBoarding && stopPoint.forAlighting)
      return BoardingType.BOARDING_AND_ALIGHTING;
    else if (stopPoint.forBoarding) return BoardingType.BOARDING;
    else if (stopPoint.forAlighting) return BoardingType.ALIGHTING;
    else return undefined;
  }, [stopPoint]);
  return selectedBoardingType;
};

export const useOnBoardingTypeChange = (
  stopPoint: StopPoint,
  onChange: (stopPoint: StopPoint) => void,
) => {
  const onBoardingTypeChange = useCallback(
    (boardingType: BoardingType) => {
      onChange({
        ...stopPoint,
        forBoarding:
          boardingType === BoardingType.BOARDING ||
          boardingType === BoardingType.BOARDING_AND_ALIGHTING,
        forAlighting:
          boardingType === BoardingType.ALIGHTING ||
          boardingType === BoardingType.BOARDING_AND_ALIGHTING,
      });
    },
    [onChange, stopPoint],
  );
  return onBoardingTypeChange;
};

const useBoardingDropDownItems = () => {
  const { formatMessage, locale } = useIntl();
  const boardingItems = useMemo(
    () => [
      { value: '0', label: formatMessage({ id: 'labelForBoarding' }) },
      { value: '1', label: formatMessage({ id: 'labelForAlighting' }) },
      {
        value: '2',
        label: formatMessage({ id: 'labelForBoardingAndAlighting' }),
      },
    ],
    [formatMessage, locale],
  );

  return boardingItems;
};

type Props = {
  boardingType: BoardingType | undefined;
  onChange: (boardingType: BoardingType) => void;
  error: keyof MessagesKey | undefined;
};

export const BoardingTypeSelect = ({
  boardingType,
  onChange,
  error,
}: Props) => {
  const { formatMessage } = useIntl();
  const boardingDropDownItems = useBoardingDropDownItems();
  const selectedItem =
    boardingDropDownItems.find((item) => item.value === boardingType) || null;
  return (
    <Autocomplete
      className="stop-point-info-item"
      value={selectedItem}
      onChange={(_event, newValue: NormalizedDropdownItemType | null) =>
        onChange(newValue?.value as BoardingType)
      }
      options={boardingDropDownItems}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => (
        <TextField
          {...params}
          label={formatMessage({ id: 'labelBoarding' })}
          placeholder={formatMessage({ id: 'defaultOption' })}
          error={!!error}
          helperText={error ? formatMessage({ id: error }) : ''}
        />
      )}
    />
  );
};
