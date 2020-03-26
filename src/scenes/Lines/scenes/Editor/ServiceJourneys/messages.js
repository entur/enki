import { defineMessages } from 'react-intl';

export default defineMessages({
  serviceJourneys: {
    id: 'lines.editor.journeyPatterns.editor.serviceJourneys',
    defaultMessage: 'Service Journeys',
  },
  edit: {
    id: 'lines.editor.journeyPatterns.editor.edit',
    defaultMessage: 'Rediger',
  },
  create: {
    id: 'lines.editor.journeyPatterns.editor.create',
    defaultMessage: 'Opprett',
  },
  save: {
    id: 'lines.editor.journeyPatterns.editor.save',
    defaultMessage: 'Lagre',
  },
  addServiceJourneys: {
    id: 'lines.editor.journeyPatterns.editor.addServiceJourneys',
    defaultMessage: 'Legg til flere Service Journeys',
  },
  availability: {
    id: 'lines.journeyPatterns.serviceJourney.availability',
    defaultMessage: 'Tilgjengelighet',
  },
  passingTimes: {
    id: 'lines.journeyPatterns.serviceJourney.passingTimes',
    defaultMessage: 'Passeringstider',
  },
  passingTimesInfo: {
    id: 'lines.journeyPatterns.serviceJourney.passingTimes.info',
    defaultMessage:
      'Fyll inn passeringstider for de ulike stoppene. Hvis du lager en sonebasert linje  fyller du inn åpningstidene. Eks. 08.00 - 15.00  for formiddag.',
  },
  booking: {
    id: 'lines.journeyPatterns.serviceJourney.booking',
    defaultMessage: 'Bestilling',
  },
  nameLabel: {
    id: 'lines.journeyPatterns.serviceJourney.general.name',
    defaultMessage: 'Navn *',
  },
  nameRequired: {
    id: 'lines.journeyPatterns.serviceJourney.general.name.isRequired',
    defaultMessage: 'Navn må fylles inn.',
  },
  description: {
    id: 'lines.journeyPatterns.serviceJourney.general.description',
    defaultMessage: 'Beskrivelse',
  },
  serviceAvailability: {
    id: 'lines.journeyPatterns.serviceJourney.general.availability',
    defaultMessage: 'Tilgjengelighet',
  },
  privateCode: {
    id: 'lines.journeyPatterns.serviceJourney.general.privateCode',
    defaultMessage: 'Privat kode',
  },
  privateCodeTooltip: {
    id: 'lines.journeyPatterns.serviceJourney.general.privateCodeTooltip',
    defaultMessage:
      'Privat kode er det som kjennetegner service journeyen internt hos en operatør',
  },
  publicCode: {
    id: 'lines.journeyPatterns.serviceJourney.general.publicCode',
    defaultMessage: 'Offentlig kode',
  },
  publicCodeTooltip: {
    id: 'lines.journeyPatterns.serviceJourney.general.publicCodeTooltip',
    defaultMessage:
      'Offentlig kode er det som kjennetegner service journeyen ut mot publikum',
  },
  operator: {
    id: 'lines.journeyPatterns.serviceJourney.general.operator',
    defaultMessage: 'Operatør',
  },
  weekdays: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.weekdays',
    defaultMessage: 'Ukedager',
  },
  availabilityMustBeFilled: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.weekdays.error',
    defaultMessage: 'Du må fylle ut tilgjengeligheten.',
  },
  passingTimesMustBeFilled: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.passingTimesEditor.error',
    defaultMessage: 'Du må ha gyldige passeringstider.',
  },
  noDayTypeAssignments: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.noDayTypeAssignments',
    defaultMessage: 'Ingen datoer er definert.',
  },
  date: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.date',
    defaultMessage: 'Dato',
  },
  fromAndToDate: {
    id:
      'lines.editor.journeyPatterns.editor.serviceJourneys.dayTypeEditor.fromAndToDate',
    defaultMessage: 'Bruk fra- og til-dato',
  },
  stopPointsInfo: {
    id: 'lines.editor.journeyPatterns.editor.stopPoints.info',
    defaultMessage:
      'Du må opprette minst to stoppepunkter. Et for påstigning og et for avstigning.',
  },
  serviceJourneysInfo: {
    id: 'lines.editor.journeyPatterns.editor.serviceJourneys.info',
    defaultMessage:
      'Du kan opprette ulike Service Journeys for ulike åpningstider. For eksempel ett for hverdag og ett for helg. ',
  },
  delete: {
    id: 'lines.editor.deleteButtonText',
    defaultMessage: 'Slett',
  },
  deleteMessage: {
    id: 'lines.journeyPatterns.serviceJourney.delete.message',
    defaultMessage:
      'Er du sikker på at du ønsker å slette denne service journeyen?',
  },
  deleteTitle: {
    id: 'lines.journeyPatterns.serviceJourney.delete.title',
    defaultMessage: 'Slette service journey',
  },
  yes: {
    id: 'lines.journeyPatterns.stopPoints.table.yes',
    defaultMessage: 'Ja',
  },
  no: {
    id: 'lines.journeyPatterns.stopPoints.table.no',
    defaultMessage: 'Nei',
  },
  stopPointDeleteMessage: {
    id: 'lines.editor.journeyPatterns.editor.stopPoints.delete.message',
    defaultMessage:
      'Er du sikker på at du ønsker å slette dette stoppepunktet?',
  },
  stopPointDeleteTitle: {
    id: 'lines.editor.journeyPatterns.editor.stopPoints.delete.title',
    defaultMessage: 'Slette stoppepunkt',
  },
  modalTitle: {
    id: 'lines.editor.journeyPatterns.editor.serviceJourneys.modal.title',
    defaultMessage: 'Ny service journey',
  },
  modalSubTitle: {
    id: 'lines.editor.journeyPatterns.editor.serviceJourneys.modal.subTitle',
    defaultMessage: 'Fyll in navn og trykk deretter Opprett',
  },
  modalCancel: {
    id: 'lines.editor.journeyPatterns.editor.serviceJourneys.modal.cancel',
    defaultMessage: 'Avbryt',
  },
  modalCreate: {
    id: 'lines.editor.journeyPatterns.editor.serviceJourneys.modal.create',
    defaultMessage: 'Opprett',
  },
  modalLabel: {
    id: 'lines.editor.journeyPatterns.editor.serviceJourneys.modal.label',
    defaultMessage: 'Navn',
  },
  modalPlaceholder: {
    id: 'lines.editor.journeyPatterns.editor.serviceJourneys.modal.placeholder',
    defaultMessage: 'Eks. "Melkeruta ettermiddag"',
  },
});
