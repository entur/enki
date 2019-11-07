import { defineMessages } from 'react-intl';

export default defineMessages({
  UNKNOWN: {
    id: 'helpers.uttu.uttuError.UNKNOWN',
    defaultMessage: 'Ukjent feil'
  },
  ORGANISATION_NOT_VALID_OPERATOR: {
    id: 'helpers.uttu.uttuError.ORGANISATION_NOT_VALID_OPERATOR',
    defaultMessage: 'Ugyldig operatør'
  },
  FROM_DATE_AFTER_TO_DATE: {
    id: 'helpers.uttu.uttuError.FROM_DATE_AFTER_TO_DATE',
    defaultMessage: 'Fra dato kan ikke være etter til dato'
  },
  ENTITY_IS_REFERENCED: {
    id: 'helpers.uttu.uttuError.ENTITY_IS_REFERENCED',
    defaultMessage:
      'Entity cannot be deleted because {noOfLines, number} other {noOfLines, plural, one {entity has a reference} other {entities have references}} to it.'
  }
});
