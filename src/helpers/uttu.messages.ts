import { defineMessages } from 'react-intl';

export enum UttuCode {
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  ENTITY_IS_REFERENCED = 'ENTITY_IS_REFERENCED',
  FROM_DATE_AFTER_TO_DATE = 'FROM_DATE_AFTER_TO_DATE',
  MINIMUM_POINTS_IN_SEQUENCE = 'MINIMUM_POINTS_IN_SEQUENCE',
  MISSING_OPERATOR = 'MISSING_OPERATOR',
  NO_VALID_FLEXIBLE_LINES_IN_DATA_SPACE = 'NO_VALID_FLEXIBLE_LINES_IN_DATA_SPACE',
  ORGANISATION_NOT_VALID_OPERATOR = 'ORGANISATION_NOT_VALID_OPERATOR',
  UNKNOWN = 'UNKNOWN',
}

export enum UttuSubCode {
  FLEXIBLE_STOP_PLACE_UNIQUE_NAME = 'FLEXIBLE_STOP_PLACE_UNIQUE_NAME',
  FLEXIBLE_LINE_UNIQUE_NAME = 'FLEXIBLE_LINE_UNIQUE_NAME',
  PROVIDER_UNIQUE_CODE = 'PROVIDER_UNIQUE_CODE',
  JOURNEY_PATTERN_UNIQUE_NAME = 'JOURNEY_PATTERN_UNIQUE_NAME',
  NETWORK_UNIQUE_NAME = 'NETWORK_UNIQUE_NAME',
  SERVICE_JOURNEY_UNIQUE_NAME = 'SERVICE_JOURNEY_UNIQUE_NAME',
  CODESPACE_UNIQUE_XMLNS = 'CODESPACE_UNIQUE_XMLNS',
}

export enum CombinedUttuCode {
  CONSTRAINT_VIOLATION_FLEXIBLE_LINE_UNIQUE_NAME = 'CONSTRAINT_VIOLATION_FLEXIBLE_LINE_UNIQUE_NAME',
  CONSTRAINT_VIOLATION_SERVICE_JOURNEY_UNIQUE_NAME = 'CONSTRAINT_VIOLATION_SERVICE_JOURNEY_UNIQUE_NAME',
}

export type UttuMessage = {
  [key in UttuCode | CombinedUttuCode]: {
    id: string;
    defaultMessage: string;
  };
};

const uttuMessages: UttuMessage = {
  [UttuCode.CONSTRAINT_VIOLATION]: {
    id: 'helpers.uttu.uttuError.CONSTRAINT_VIOLATION',
    defaultMessage:
      'Noe av dataen er ikke unik, og møter ikke databasens restriksjoner',
  },
  [UttuCode.UNKNOWN]: {
    id: 'helpers.uttu.uttuError.UNKNOWN',
    defaultMessage: 'Ukjent feil',
  },
  [UttuCode.ORGANISATION_NOT_VALID_OPERATOR]: {
    id: 'helpers.uttu.uttuError.ORGANISATION_NOT_VALID_OPERATOR',
    defaultMessage: 'Ugyldig operatør',
  },
  [UttuCode.MISSING_OPERATOR]: {
    id: 'helpers.uttu.uttuError.MISSING_OPERATOR',
    defaultMessage: 'Tur eller linje må ha operatør',
  },
  [UttuCode.FROM_DATE_AFTER_TO_DATE]: {
    id: 'helpers.uttu.uttuError.FROM_DATE_AFTER_TO_DATE',
    defaultMessage: 'Fra dato kan ikke være etter til dato',
  },
  [UttuCode.ENTITY_IS_REFERENCED]: {
    id: 'helpers.uttu.uttuError.ENTITY_IS_REFERENCED',
    defaultMessage:
      'Entity cannot be deleted because {noOfLines, number} other {noOfLines, plural, one {entity has a reference} other {entities have references}} to it.',
  },
  [UttuCode.MINIMUM_POINTS_IN_SEQUENCE]: {
    id: 'helpers.uttu.uttuError.MINIMUM_POINTS_IN_SEQUENCE',
    defaultMessage: 'Reisemønster må ha minimum 2 sekvensielle stoppepunkter.',
  },
  [UttuCode.NO_VALID_FLEXIBLE_LINES_IN_DATA_SPACE]: {
    id: 'helpers.uttu.uttuError.MINIMUM_POINTS_IN_SEQUENCE',
    defaultMessage: 'Reisemønster må ha minimum 2 sekvensielle stoppepunkter.',
  },
  [CombinedUttuCode.CONSTRAINT_VIOLATION_FLEXIBLE_LINE_UNIQUE_NAME]: {
    id: 'helpers.uttu.uttuError.CONSTRAINT_VIOLATION_FLEXIBLE_LINE_UNIQUE_NAME',
    defaultMessage: 'Linjen må ha et unikt navn',
  },
  [CombinedUttuCode.CONSTRAINT_VIOLATION_SERVICE_JOURNEY_UNIQUE_NAME]: {
    id:
      'helpers.uttu.uttuError.CONSTRAINT_VIOLATION_SERVICE_JOURNEY_UNIQUE_NAME',
    defaultMessage: 'Service journeyen må ha et unikt navn',
  },
};

export default defineMessages(uttuMessages);
