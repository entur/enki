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
  MISSING_OPERATOR: {
    id: 'helpers.uttu.uttuError.MISSING_OPERATOR',
    defaultMessage: 'Tur eller linje må ha operatør'
  },
  FROM_DATE_AFTER_TO_DATE: {
    id: 'helpers.uttu.uttuError.FROM_DATE_AFTER_TO_DATE',
    defaultMessage: 'Fra dato kan ikke være etter til dato'
  },
  ENTITY_IS_REFERENCED: {
    id: 'helpers.uttu.uttuError.ENTITY_IS_REFERENCED',
    defaultMessage:
      'Entity cannot be deleted because {noOfLines, number} other {noOfLines, plural, one {entity has a reference} other {entities have references}} to it.'
  },
  MINIMUM_POINTS_IN_SEQUENCE: {
    id: 'helpers.uttu.uttuError.MINIMUM_POINTS_IN_SEQUENCE',
    defaultMessage: 'Reisemønster må ha minimum 2 sekvensielle stoppepunkter'
  },
  CONSTRAINT_VIOLATION_FLEXIBLE_LINE_UNIQUE_NAME: {
    id: 'helpers.uttu.uttuError.CONSTRAINT_VIOLATION_FLEXIBLE_LINE_UNIQUE_NAME',
    defaultMessage: 'Linjen må ha et unikt navn'
  }
});
