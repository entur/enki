import FlexibleLine from 'model/FlexibleLine';
import { isBlank } from 'helpers/forms';
import { validJourneyPattern } from 'components/JourneyPatternEditor/StopPointEditor/validateForm';
import { validServiceJourneys } from 'components/ServiceJourneyEditor/validate';

export const validFlexibleLine = (
  line: FlexibleLine,
  isFlexibleLine: boolean
): boolean =>
  aboutLineStepIsValid(line, isFlexibleLine) &&
  validJourneyPattern(line.journeyPatterns) &&
  validServiceJourneys(line.journeyPatterns?.[0].serviceJourneys);

export const getMaxAllowedStepIndex = (
  line: FlexibleLine,
  isFlexibleLine: boolean
) => {
  if (!aboutLineStepIsValid(line, isFlexibleLine)) return 0;
  else if (!validJourneyPattern(line.journeyPatterns)) return 1;
  else if (!validServiceJourneys(line.journeyPatterns?.[0]?.serviceJourneys))
    return 2;
  else return 3;
};

export const currentStepIsValid = (
  currentStep: number,
  line: FlexibleLine,
  isFlexibleLine: boolean
) => {
  if (currentStep === 0) return aboutLineStepIsValid(line, isFlexibleLine);
  else if (currentStep === 1) return validJourneyPattern(line.journeyPatterns);
  else if (currentStep === 2)
    return validServiceJourneys(line.journeyPatterns?.[0].serviceJourneys);
  else if (currentStep === 3) return true;
  else return false;
};

export const aboutLineStepIsValid = (
  line: FlexibleLine,
  isFlexibleLine: boolean
): boolean =>
  !isBlank(line.name) &&
  !isBlank(line.publicCode) &&
  !isBlank(line.operatorRef) &&
  !isBlank(line.networkRef) &&
  !isBlank(line.transportMode) &&
  !isBlank(line.transportSubmode) &&
  (!isBlank(line.flexibleLineType) || !isFlexibleLine);
