import {defineMessages} from 'react-intl';

export default defineMessages({
  title: {
    id: 'lines.editor.bookingArrangementEditor.bookingMethodSelection.title',
    defaultMessage: 'Hvordan bestille'
  }
});

export const bookingMethodMessages = defineMessages({
  callDriver: {
    id: 'lines.editor.bookingArrangementEditor.bookingMethodSelection.callDriver',
    defaultMessage: 'Ring fører'
  },
  callOffice: {
    id: 'lines.editor.bookingArrangementEditor.bookingMethodSelection.callOffice',
    defaultMessage: 'Ring kundeservice'
  },
  online: {
    id: 'lines.editor.bookingArrangementEditor.bookingMethodSelection.online',
    defaultMessage: 'På nett'
  },
  phoneAtStop: {
    id: 'lines.editor.bookingArrangementEditor.bookingMethodSelection.phoneAtStop',
    defaultMessage: 'Telefon på stoppested'
  },
  text: {
    id: 'lines.editor.bookingArrangementEditor.bookingMethodSelection.text',
    defaultMessage: 'SMS'
  }
});
