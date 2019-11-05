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
    id: `lines.editor.bookingArrangementEditor.bookingTimeSelection.purchaseWhen.${PURCHASE_WHEN.TIME_OF_TRAVEL_ONLY}`,
    defaultMessage: 'Ved reisetidspunkt'
  },
  [PURCHASE_WHEN.DAY_OF_TRAVEL_ONLY]: {
    id: `lines.editor.bookingArrangementEditor.bookingTimeSelection.purchaseWhen.${PURCHASE_WHEN.DAY_OF_TRAVEL_ONLY}`,
    defaultMessage: 'Samme dag'
  },
  [PURCHASE_WHEN.UNTIL_PREVIOUS_DAY]: {
    id: `lines.editor.bookingArrangementEditor.bookingTimeSelection.purchaseWhen.${PURCHASE_WHEN.UNTIL_PREVIOUS_DAY}`,
    defaultMessage: 'Inntil dagen før'
  },
  [PURCHASE_WHEN.ADVANCE_AND_DAY_OF_TRAVEL]: {
    id: `lines.editor.bookingArrangementEditor.bookingTimeSelection.purchaseWhen.${PURCHASE_WHEN.ADVANCE_AND_DAY_OF_TRAVEL}`,
    defaultMessage: 'Frem til og med samme dag'
  },
});
