import Line from 'model/Line';
import { aboutLineStepIsValid } from 'scenes/FlexibleLines/scenes/Editor/validateForm';
import { validJourneyPattern } from 'scenes/FlexibleLines/scenes/Editor/JourneyPatterns/Editor/StopPoints/Editor/validateForm';
import { validServiceJourneys } from 'scenes/FlexibleLines/scenes/Editor/ServiceJourneys/Editor/validate';

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
