import { defineMessages } from 'react-intl';

export default defineMessages({
  stopPlace: {
    id: 'stopPlace',
    defaultMessage: 'Stoppested *',
  },
  labelBoarding: {
    id: 'lines.journeyPatterns.stopPoints.form.label.boarding',
    defaultMessage: 'På-/avstigning',
  },
  labelQuayRef: {
    id: 'lines.journeyPatterns.stopPoints.form.label.quayRef',
    defaultMessage: 'Plattform-ID (fra NSR) *',
  },
  labelFrontText: {
    id: 'lines.journeyPatterns.stopPoints.form.label.frontText',
    defaultMessage: 'Fronttekst',
  },
  labelForBoarding: {
    id: 'lines.journeyPatterns.stopPoints.form.label.forBoarding',
    defaultMessage: 'For påstigning',
  },
  labelForAlighting: {
    id: 'lines.journeyPatterns.stopPoints.form.label.forAlighting',
    defaultMessage: 'For avstigning',
  },
  labelForBoth: {
    id: 'lines.journeyPatterns.stopPoints.form.label.forBoardingAndAlighting',
    defaultMessage: 'På- og avstigning',
  },
  selectCustom: {
    id: 'lines.editor.journeyPatterns.editor.stopPoints.select.custom',
    defaultMessage: 'Stoppested',
  },
  selectNSR: {
    id: 'lines.editor.journeyPatterns.editor.stopPoints.select.nsr',
    defaultMessage: 'Plattform-ID NSR',
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
  delete: {
    id: 'lines.editor.deleteButtonText',
    defaultMessage: 'Slett',
  },
});
