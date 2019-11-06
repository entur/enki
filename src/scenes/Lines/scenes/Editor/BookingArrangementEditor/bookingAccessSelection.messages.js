import {defineMessages} from 'react-intl';
import {
  BOOKING_ACCESS
} from '../../../../../model/enums';

export default defineMessages({
  title: {
    id: 'lines.editor.bookingArrangementEditor.bookingAccessSelection.title',
    defaultMessage: 'Tilgang'
  }
});

export const bookingAccessMessages = defineMessages({
  [BOOKING_ACCESS.PUBLIC]: {
    id: `lines.editor.bookingArrangementEditor.bookingAccessSelection.bookingAccess.public`,
    defaultMessage: 'Åpen'
  },
  [BOOKING_ACCESS.AUTHORISED_PUBLIC]: {
    id: `lines.editor.bookingArrangementEditor.bookingAccessSelection.bookingAccess.authorisedPublic`,
    defaultMessage: 'Forhåndsgodkjent'
  },
  [BOOKING_ACCESS.STAFF]: {
    id: `lines.editor.bookingArrangementEditor.bookingAccessSelection.bookingAccess.staff`,
    defaultMessage: 'Ansatte'
  },
});
