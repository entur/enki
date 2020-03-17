import { defineMessages } from 'react-intl';

export default defineMessages({
  journeyPattern: {
    id: 'lines.editor.journeyPatternsTabLabel',
    defaultMessage: 'Journey patterns'
  },
  enterInformation: {
    id: 'lines.editor.journeyPatterns.editor.fillInformation',
    defaultMessage: 'Fyll inn informasjon om Journey Pattern.'
  },
  stopPoints: {
    id: 'lines.editor.journeyPatterns.editor.stopPoints',
    defaultMessage: 'Legg til stoppepunkter for Journey Pattern'
  },
  serviceJourneys: {
    id: 'lines.editor.journeyPatterns.editor.serviceJourneys',
    defaultMessage: 'Service Journeys'
  },
  edit: {
    id: 'lines.editor.journeyPatterns.editor.edit',
    defaultMessage: 'Rediger'
  },
  create: {
    id: 'lines.editor.journeyPatterns.editor.create',
    defaultMessage: 'Opprett'
  },
  save: {
    id: 'lines.editor.journeyPatterns.editor.save',
    defaultMessage: 'Lagre'
  },
  addStopPoint: {
    id: 'lines.editor.journeyPatterns.editor.addStopPoint',
    defaultMessage: 'Legg til stoppepunkt'
  },
  addServiceJourneys: {
    id: 'lines.editor.journeyPatterns.editor.addServiceJourneys',
    defaultMessage: 'Legg til service journey'
  },
  atleastTwoPoints: {
    id: 'lines.editor.journeyPatterns.editor.stopPoints.atleastTwoPoints',
    defaultMessage: 'Minst to stoppepunkter'
  },
  atleastTwoPointsDetailed: {
    id:
      'lines.editor.journeyPatterns.editor.stopPoints.atleastTwoPointsDetailed',
    defaultMessage: 'Et journey pattern krever minst to stoppepunkter.'
  },
  availability: {
    id: 'lines.journeyPatterns.serviceJourney.availability',
    defaultMessage: 'Tilgjengelighet'
  },
  passingTimes: {
    id: 'lines.journeyPatterns.serviceJourney.passingTimes',
    defaultMessage: 'Passeringstider'
  },
  booking: {
    id: 'lines.journeyPatterns.serviceJourney.booking',
    defaultMessage: 'Bestilling'
  },
  nameLabel: {
    id: 'lines.journeyPatterns.serviceJourney.general.name',
    defaultMessage: '* Navn'
  },
  nameRequired: {
    id: 'lines.journeyPatterns.serviceJourney.general.name.isRequired',
    defaultMessage: 'Navn må fylles inn.'
  },
  description: {
    id: 'lines.journeyPatterns.serviceJourney.general.description',
    defaultMessage: 'Beskrivelse'
  },
  serviceAvailability: {
    id: 'lines.journeyPatterns.serviceJourney.general.availability',
    defaultMessage: 'Tilgjengelighet'
  },
  publicCode: {
    id: 'lines.journeyPatterns.serviceJourney.general.publicCode',
    defaultMessage: 'Offentlig kode'
  },
  operator: {
    id: 'lines.journeyPatterns.serviceJourney.general.operator',
    defaultMessage: 'Operatør'
  },
  weekdays: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.weekdays',
    defaultMessage: 'Ukedager'
  },
  availabilityMustBeFilled: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.weekdays.error',
    defaultMessage: 'Du må fylle ut tilgjengeligheten.'
  },
  passingTimesMustBeFilled: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.passingTimesEditor.error',
    defaultMessage: 'Du må ha gyldige passeringstider.'
  },
  dates: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.dates',
    defaultMessage: 'Datoer'
  },
  addDayTypeAssignment: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.addDayTypeAssignment',
    defaultMessage: 'Legg til dato'
  },
  noDayTypeAssignments: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.noDayTypeAssignments',
    defaultMessage: 'Ingen datoer er definert.'
  },
  date: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.date',
    defaultMessage: 'Dato'
  },
  fromAndToDate: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.fromAndToDate',
    defaultMessage: 'Bruk fra- og til-dato'
  },
  fromDate: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.fromDate',
    defaultMessage: 'Fra dato'
  },
  toDate: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.toDate',
    defaultMessage: 'Til dato'
  },
  stopPointsInfo: {
    id: 'lines.editor.journeyPatterns.editor.stopPoints.info',
    defaultMessage:
      'Du må opprette minst to stoppepunkter. Velg fra liste over allerede eksisterende stoppesteder, lag nytt stoppested, eller benytt plattform-ID fra NSR.'
  },
  serviceJourneysInfo: {
    id: 'lines.editor.journeyPatterns.editor.serviceJourneys.info',
    defaultMessage:
      'Opprett ulike Service Journeys for ulike åpningstider. For eksempel én for hverdag og én for helg.'
  },
  deleteMessage: {
    id: 'lines.journeyPatterns.serviceJourney.delete.message',
    defaultMessage:
      'Er du sikker på at du ænsker å slette denne service journeyen?'
  },
  deleteTitle: {
    id: 'lines.journeyPatterns.serviceJourney.delete.title',
    defaultMessage: 'Slette service journey'
  }
});
