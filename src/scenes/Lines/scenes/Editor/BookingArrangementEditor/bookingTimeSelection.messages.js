import {defineMessages} from 'react-intl';
import {
  PURCHASE_WHEN
} from '../../../../../model/enums';

export default defineMessages({
  title: {
    id: 'lines.editor.bookingArrangementeditor.bookingTimeSelection.title',
    defaultMessage: 'Kan bestilles'
  }
});

export const bookingTimeMessages = defineMessages({
  [PURCHASE_WHEN.TIME_OF_TRAVEL_ONLY]: {
    id: `lines.editor.bookingArrangementEditor.bookingTimeSelection.purchaseWhen.timeOfTravelOnly`,
    defaultMessage: 'Ved reisetidspunkt'
  },
  [PURCHASE_WHEN.DAY_OF_TRAVEL_ONLY]: {
    id: `lines.editor.bookingArrangementEditor.bookingTimeSelection.purchaseWhen.dayOfTravelOnly`,
    defaultMessage: 'Samme dag'
  },
  [PURCHASE_WHEN.UNTIL_PREVIOUS_DAY]: {
    id: `lines.editor.bookingArrangementEditor.bookingTimeSelection.purchaseWhen.untilPreviousDay`,
    defaultMessage: 'Inntil dagen før'
  },
  [PURCHASE_WHEN.ADVANCE_AND_DAY_OF_TRAVEL]: {
    id: `lines.editor.bookingArrangementEditor.bookingTimeSelection.purchaseWhen.advanceAndDayOfTravel`,
    defaultMessage: 'Frem til og med samme dag'
  },
});
