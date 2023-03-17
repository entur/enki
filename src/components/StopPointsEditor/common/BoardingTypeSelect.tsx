import { Dropdown } from '@entur/dropdown';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import { selectIntl } from 'i18n';
import { MessagesKey } from 'i18n/translations/translationKeys';
import StopPoint from 'model/StopPoint';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

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
  onChange: (stopPoint: StopPoint) => void
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
    [onChange, stopPoint]
  );
  return onBoardingTypeChange;
};

const useBoardingDropDownItems = () => {
  const { formatMessage } = useSelector(selectIntl);
  const boardingItems = useMemo(
    () => [
      { value: '0', label: formatMessage('labelForBoarding') },
      { value: '1', label: formatMessage('labelForAlighting') },
      {
        value: '2',
        label: formatMessage('labelForBoardingAndAlighting'),
      },
    ],
    [formatMessage]
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
  const { formatMessage } = useSelector(selectIntl);
  const boardingDropDownItems = useBoardingDropDownItems();
  return (
    <Dropdown
      className="stop-point-info-item"
      label={formatMessage('labelBoarding')}
      value={boardingType}
      placeholder={formatMessage('defaultOption')}
      onChange={(element: NormalizedDropdownItemType | null) =>
        onChange(element?.value as BoardingType)
      }
      items={boardingDropDownItems}
      feedback={error && formatMessage(error)}
      variant={error ? 'error' : undefined}
    />
  );
};
