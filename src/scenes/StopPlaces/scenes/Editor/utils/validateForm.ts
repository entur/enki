import { isBlank } from 'helpers/forms';
import { MessagesKey } from 'i18n/translations/translationKeys';
import FlexibleStopPlace from 'model/FlexibleStopPlace';

export type FlexibleStopPlaceErrors = {
  name?: keyof MessagesKey;
  flexibleArea?: keyof MessagesKey;
};

export const validateFlexibleStopPlace = ({
  name,
  flexibleAreas,
}: FlexibleStopPlace): FlexibleStopPlaceErrors => ({
  name: isBlank(name) ? 'validateFormErrorNameEmpty' : undefined,
  flexibleArea: flexibleAreas?.every(
    (flexibleArea) => (flexibleArea.polygon?.coordinates?.length ?? 0) < 4
  )
    ? 'validateFormErrorFlexibleAreaNotEnoughPolygons'
    : undefined,
});
