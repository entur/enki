import { isBlank } from 'helpers/forms';
import { MessagesKey } from 'i18n/translations/translationKeys';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { KeyValues } from 'model/KeyValues';
import { FLEXIBLE_STOP_AREA_TYPE } from 'model/enums';

export type FlexibleStopPlaceErrors = {
  name?: keyof MessagesKey;
  flexibleArea?: keyof MessagesKey;
  flexibleStopPlaceType?: keyof MessagesKey;
};

export const validateFlexibleStopPlace = ({
  name,
  flexibleAreas,
  keyValues,
}: FlexibleStopPlace): FlexibleStopPlaceErrors => ({
  name: isBlank(name) ? 'validateFormErrorNameEmpty' : undefined,
  flexibleArea: flexibleAreas?.some(
    (flexibleArea) => (flexibleArea.polygon?.coordinates?.length ?? 0) < 4
  )
    ? 'validateFormErrorFlexibleAreaNotEnoughPolygons'
    : undefined,
  flexibleStopPlaceType:
    !validateFlexibleStopPlaceType({ keyValues }) &&
    flexibleAreas?.some(
      (flexibleArea) =>
        !validateFlexibleStopPlaceType({ keyValues: flexibleArea.keyValues })
    )
      ? 'validateFormErrorFlexibleStopPlaceType'
      : undefined,
});

export const validateFlexibleStopPlaceType = ({
  keyValues,
}: {
  keyValues: KeyValues[] | undefined;
}): boolean => {
  const flexibleStopPlaceType = keyValues?.find(
    (keyValue) => keyValue.key === 'FlexibleStopAreaType'
  );

  return (
    flexibleStopPlaceType?.values.length === 1 &&
    Object.values(FLEXIBLE_STOP_AREA_TYPE).includes(
      flexibleStopPlaceType?.values[0] as FLEXIBLE_STOP_AREA_TYPE
    )
  );
};
