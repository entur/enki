import { defineMessages } from 'react-intl';

export default defineMessages({
  saveLineSuccessHeader: {
    id: 'actions.flexibleLines.saveLineSuccessHeader',
    defaultMessage: 'Lagre linje',
    description: 'Success notification headerm, when saving a line'
  },
  saveLineSuccessMessage: {
    id: 'actions.flexibleLines.saveLineSuccessMessage',
    defaultMessage: 'Linjen ble lagret',
    description: 'Success notification message, when saving a line'
  },
  saveLineErrorHeader: {
    id: 'actions.flexibleLines.saveLineErrorHeader',
    defaultMessage: 'Lagre linje',
    description: 'Error notification header, when saving a line failed'
  },
  saveLineErrorMessage: {
    id: 'actions.flexibleLines.saveLineErrorMessage',
    defaultMessage: 'En feil oppstod under lagringen av linjen: {details}',
    description: 'Error notification message, when saving a line failed'
  }
});
