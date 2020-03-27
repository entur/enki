import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { isBlank } from 'helpers/forms';
import { MessagesKey } from 'i18n/translations/translationKeys';

export type FlexibleStopPlaceErrors = {
  name?: keyof MessagesKey;
  flexibleArea?: keyof MessagesKey;
};

export const validateFlexibleStopPlace = ({
  name,
  flexibleArea,
}: FlexibleStopPlace): FlexibleStopPlaceErrors => ({
  name: isBlank(name) ? 'validateFormErrorNameEmpty' : undefined,
  flexibleArea:
    (flexibleArea?.polygon?.coordinates?.length ?? 0) < 4
      ? 'validateFormErrorFlexibleAreaNotEnoughPolygons'
      : undefined,
});
