import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { isBlank } from 'helpers/forms';
import messages from './validateForm.messages';

export type FlexibleStopPlaceErrors = {
  name: any | undefined;
  flexibleArea: any | undefined;
};

export const validateFlexibleStopPlace = ({
  name,
  flexibleArea
}: FlexibleStopPlace): FlexibleStopPlaceErrors => ({
  name: isBlank(name) ? messages.errorNameEmpty : undefined,
  flexibleArea:
    (flexibleArea?.polygon?.coordinates?.length ?? 0) < 4
      ? messages.errorFlexibleAreaNotEnoughPolygons
      : undefined
});
