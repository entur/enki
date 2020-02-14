import { defineMessages } from 'react-intl';

export default defineMessages({
  atleastOneField: {
    id: 'passingTimes.error.atleastOneField',
    defaultMessage: 'Minst ett felt må være fylt ut.'
  },
  departureAfterArrival: {
    id: 'passingTimes.error.departureAfterArrival',
    defaultMessage: 'Avgangstid kan ikke være før ankomsttid.'
  },
  departureAfterEarliest: {
    id: 'passingTimes.error.departureAfterEarliest',
    defaultMessage: 'Avgangstid kan ikke være før tidligst avgangstid.'
  },
  arrivalBeforeLatest: {
    id: 'passingTimes.error.arrivalBeforeLatest',
    defaultMessage: 'Ankomsttid ikke kan være senere enn senest ankomsttid.'
  },
  laterThanPrevious: {
    id: 'passingTimes.error.laterThanPrevious',
    defaultMessage:
      'Tidspunktene må være senere enn forrige stoppesteds tidspunkt.'
  },
  lastArrivalMustBeSet: {
    id: 'passingTimes.error.lastArrivalMustBeSet',
    defaultMessage:
      'Ankomsttid eller seneste ankomsttid for siste stoppested må være satt.'
  }
});
