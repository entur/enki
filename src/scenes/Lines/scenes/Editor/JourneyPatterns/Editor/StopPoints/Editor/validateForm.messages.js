import { defineMessages } from 'react-intl';

export default defineMessages({
  errorFlexibleStopPlaceRefAndQuayRefNoValues: {
    id:
      'lines.journeyPatterns.stopPoints.validateForm.error.flexibleStopPlaceRefAndQuayRef.noValues',
    defaultMessage: 'Du må velge et sted'
  },
  errorFlexibleStopPlaceRefAndQuayRefBothValues: {
    id:
      'lines.journeyPatterns.stopPoints.validateForm.error.flexibleStopPlaceRefAndQuayRef.bothValues',
    defaultMessage: 'Velg enten stoppested eller plattform, ikke begge.'
  },
  errorQuayRefInvalid: {
    id: 'lines.journeyPatterns.stopPoints.validateForm.error.quayRef.invalid',
    defaultMessage: 'Ugyldig plattform-ID'
  },
  errorFrontTextNoValue: {
    id: 'lines.journeyPatterns.stopPoints.validateForm.error.frontText.noValue',
    defaultMessage: 'Du må oppgi fronttekst'
  }
});
