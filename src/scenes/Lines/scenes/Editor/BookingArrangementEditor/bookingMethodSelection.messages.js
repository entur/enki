import { defineMessages } from 'react-intl';
import { BOOKING_METHOD } from 'model/enums';

export default defineMessages({
  title: {
    id: 'lines.editor.bookingArrangementEditor.bookingMethodSelection.title',
    defaultMessage: 'Hvordan bestille',
  },
});

export const bookingMethodMessages = defineMessages({
  [BOOKING_METHOD.CALL_DRIVER]: {
    id: `lines.editor.bookingArrangementEditor.bookingMethodSelection.bookingMethod.callDriver`,
    defaultMessage: 'Ring fører',
  },
  [BOOKING_METHOD.CALL_OFFICE]: {
    id: `lines.editor.bookingArrangementEditor.bookingMethodSelection.bookingMethod.callOffice`,
    defaultMessage: 'Ring kundeservice',
  },
  [BOOKING_METHOD.ONLINE]: {
    id: `lines.editor.bookingArrangementEditor.bookingMethodSelection.bookingMethod.online`,
    defaultMessage: 'På nett',
  },
  [BOOKING_METHOD.PHONE_AT_STOP]: {
    id: `lines.editor.bookingArrangementEditor.bookingMethodSelection.bookingMethod.phoneAtStop`,
    defaultMessage: 'Telefon på stoppested',
  },
  [BOOKING_METHOD.TEXT]: {
    id: `lines.editor.bookingArrangementEditor.bookingMethodSelection.bookingMethod.text`,
    defaultMessage: 'SMS',
  },
});
