import { defineMessages } from 'react-intl';

export default defineMessages({
  passingTime: {
    id: 'passingTimes.passingTime',
    defaultMessage: 'Passeringstid *',
  },
  dayTimeOffset: {
    id: 'passingTimes.dayTimeOffset',
    defaultMessage: 'Daytime offset',
  },
  dayTimeOffsetTooltip: {
    id: 'passingTimes.dayTimeOffsetTooltip',
    defaultMessage:
      'Sett offset dersom passeringstiden er én eller flere dager senere enn tilbudets avreise',
  },
  atleastOneField: {
    id: 'passingTimes.error.atleastOneField',
    defaultMessage: 'Minst ett felt må være fylt ut.',
  },
  departureAfterArrival: {
    id: 'passingTimes.error.departureAfterArrival',
    defaultMessage: 'Avgangstid kan ikke være før ankomsttid.',
  },
  departureAfterEarliest: {
    id: 'passingTimes.error.departureAfterEarliest',
    defaultMessage: 'Avgangstid kan ikke være før tidligst avgangstid.',
  },
  arrivalBeforeLatest: {
    id: 'passingTimes.error.arrivalBeforeLatest',
    defaultMessage: 'Ankomsttid ikke kan være senere enn senest ankomsttid.',
  },
  laterThanPrevious: {
    id: 'passingTimes.error.laterThanPrevious',
    defaultMessage:
      'Tidspunktene må være senere enn forrige stoppesteds tidspunkt.',
  },
  lastArrivalMustBeSet: {
    id: 'passingTimes.error.lastArrivalMustBeSet',
    defaultMessage:
      'Ankomsttid eller seneste ankomsttid for siste stoppested må være satt.',
  },
  stopPointsInfo: {
    id: 'passingTimes.error.stopPoints',
    defaultMessage: 'Du må opprette minst to stoppepunkter.',
  },
  aRowIsMissingData: {
    id: 'passingTimes.error.aRowIsMissingData',
    defaultMessage: 'Minst èn av radene mangler tidspunkter.',
  },
});
