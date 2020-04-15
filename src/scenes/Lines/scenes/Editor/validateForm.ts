import FlexibleLine from 'model/FlexibleLine';
import { isBlank } from 'helpers/forms';
import { validJourneyPattern } from './JourneyPatterns/Editor/StopPoints/Editor/validateForm';
import { validServiceJourneys } from './ServiceJourneys/Editor/validate';

export const validFlexibleLine = (flexibleLine: FlexibleLine): boolean =>
  aboutLineStepIsValid(flexibleLine) &&
  validJourneyPattern(flexibleLine.journeyPatterns) &&
  validServiceJourneys(flexibleLine.journeyPatterns?.[0].serviceJourneys);

export const getMaxAllowedStepIndex = (flexibleLine: FlexibleLine) => {
  if (!aboutLineStepIsValid(flexibleLine)) return 0;
  else if (!validJourneyPattern(flexibleLine.journeyPatterns)) return 1;
  else if (
    !validServiceJourneys(flexibleLine.journeyPatterns?.[0]?.serviceJourneys)
  )
    return 2;
  else return 3;
};

export const currentStepIsValid = (
  currentStep: number,
  flexibleLine: FlexibleLine
) => {
  if (currentStep === 0) return aboutLineStepIsValid(flexibleLine);
  else if (currentStep === 1)
    return validJourneyPattern(flexibleLine.journeyPatterns);
  else if (currentStep === 2)
    return validServiceJourneys(
      flexibleLine.journeyPatterns?.[0].serviceJourneys
    );
  else if (currentStep === 3) return true;
  else return false;
};

export const aboutLineStepIsValid = (flexibleLine: FlexibleLine): boolean =>
  !isBlank(flexibleLine.name) &&
  !isBlank(flexibleLine.publicCode) &&
  !isBlank(flexibleLine.operatorRef) &&
  !isBlank(flexibleLine.flexibleLineType) &&
  !isBlank(flexibleLine.networkRef);
