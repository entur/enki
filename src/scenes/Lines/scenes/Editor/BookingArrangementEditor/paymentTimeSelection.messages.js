import {defineMessages} from 'react-intl';
import {
  PURCHASE_MOMENT,
} from '../../../../../model/enums';

export default defineMessages({
  title: {
    id: 'lines.editor.bookingArrangementEditor.paymentSelection.title',
    defaultMessage: 'Betalingstidspunkt'
  }
});

export const paymentTimeMessages = defineMessages({
  [PURCHASE_MOMENT.ON_RESERVATION]: {
    id: `lines.editor.bookingArrangementEditor.paymentSelection.purchaseMoment.${PURCHASE_MOMENT.ON_RESERVATION}`,
    defaultMessage: 'Ved reservering'
  },
  [PURCHASE_MOMENT.BEFORE_BOARDING]: {
    id: `lines.editor.bookingArrangementEditor.paymentSelection.purchaseMoment.${PURCHASE_MOMENT.BEFORE_BOARDING}`,
    defaultMessage: 'Før ombordstigning'
  },
  [PURCHASE_MOMENT.AFTER_BOARDING]: {
    id: `lines.editor.bookingArrangementEditor.paymentSelection.purchaseMoment.${PURCHASE_MOMENT.AFTER_BOARDING}`,
    defaultMessage: 'Etter ombordstigning'
  },
  [PURCHASE_MOMENT.ON_CHECK_OUT]: {
    id: `lines.editor.bookingArrangementEditor.paymentSelection.purchaseMoment.${PURCHASE_MOMENT.ON_CHECK_OUT}`,
    defaultMessage: 'Ved utsjekk'
  },
});
