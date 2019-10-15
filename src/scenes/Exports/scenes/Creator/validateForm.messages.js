import { defineMessages } from 'react-intl';

export default defineMessages({
  errorExportNameIsEmpty: {
    id: 'exports.creator.validateForm.errorExportNameIsEmpty',
    defaultMessage: 'Navn mangler'
  },
  errorExportFromDateIsEmpty: {
    id: 'exports.creator.validateForm.errorExportFromDateIsEmpty',
    defaultMessage: 'Fra dato mangler'
  },
  errorExportToDateIsEmpty: {
    id: 'exports.creator.validateForm.errorExportToDateIsEmpty',
    defaultMessage: 'Til dato mangler'
  },
  errorExportFromDateIsAfterToDate: {
    id: 'exports.creator.validateForm.errorExportFromDateIsAfterToDate',
    defaultMessage: 'Fra dato kan ikke være etter til dato'
  }
});
