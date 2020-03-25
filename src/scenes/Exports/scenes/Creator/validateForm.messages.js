import { defineMessages } from 'react-intl';

export default defineMessages({
  errorExportNameIsEmpty: {
    id: 'exports.creator.validateForm.errorExportNameIsEmpty',
    defaultMessage: 'Navn mangler'
  },
  errorExportFromDateIsAfterToDate: {
    id: 'exports.creator.validateForm.errorExportFromDateIsAfterToDate',
    defaultMessage: 'Til-dato må være etter fra-dato'
  }
});
