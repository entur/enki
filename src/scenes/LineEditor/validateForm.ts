import Line from 'model/Line';
import { aboutLineStepIsValid } from 'scenes/FlexibleLineEditor/validateForm';
import { validJourneyPattern } from 'scenes/FlexibleLineEditor/JourneyPatternEditor/StopPointEditor/validateForm';
import { validServiceJourneys } from 'scenes/FlexibleLineEditor/ServiceJourneyEditor/validate';

export const validLine = (line: Line): boolean =>
  aboutLineStepIsValid(line, false) &&
  validJourneyPattern(line.journeyPatterns) &&
  validServiceJourneys(line.journeyPatterns?.[0].serviceJourneys);

export const currentStepIsValid = (currentStep: number, line: Line) => {
  if (currentStep === 0) return aboutLineStepIsValid(line, false);
  else if (currentStep === 1) return validJourneyPattern(line.journeyPatterns);
  else if (currentStep === 2)
    return validServiceJourneys(line.journeyPatterns?.[0].serviceJourneys);
  else if (currentStep === 3) return true;
  else return false;
};

export const getMaxAllowedStepIndex = (line: Line) => {
  if (!aboutLineStepIsValid(line, false)) return 0;
  else if (!validJourneyPattern(line.journeyPatterns)) return 1;
  else if (!validServiceJourneys(line.journeyPatterns?.[0]?.serviceJourneys))
    return 2;
  else return 3;
};
