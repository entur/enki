import Line from 'model/Line';
import { validJourneyPattern } from 'components/JourneyPatternEditor/StopPointEditor/validateForm';
import { validServiceJourneys } from 'components/ServiceJourneyEditor/validate';
import { isBlank } from 'helpers/forms';

export const validLine = (line: Line): boolean =>
  aboutLineStepIsValid(line) &&
  line.journeyPatterns!.every(
    (jp) => validJourneyPattern(jp) && validServiceJourneys(jp.serviceJourneys)
  );

export const getMaxAllowedStepIndex = (line: Line) => {
  if (!aboutLineStepIsValid(line)) return 0;
  else if (line.journeyPatterns!.some((jp) => !validJourneyPattern(jp)))
    return 1;
  else if (
    line.journeyPatterns!.some(
      (jp) => !validServiceJourneys(jp.serviceJourneys)
    )
  )
    return 2;
  else return 3;
};

export const currentStepIsValid = (currentStep: number, line: Line) => {
  if (currentStep === 0) return aboutLineStepIsValid(line);
  else if (currentStep === 1)
    return line.journeyPatterns!.every((jp) => validJourneyPattern(jp));
  else if (currentStep === 2)
    return line.journeyPatterns!.every((jp) =>
      validServiceJourneys(jp.serviceJourneys)
    );
  else if (currentStep === 3) return true;
  else return false;
};

export const aboutLineStepIsValid = (line: Line): boolean =>
  !isBlank(line.name) &&
  !isBlank(line.publicCode) &&
  !isBlank(line.operatorRef) &&
  !isBlank(line.networkRef) &&
  !isBlank(line.transportMode) &&
  !isBlank(line.transportSubmode);
