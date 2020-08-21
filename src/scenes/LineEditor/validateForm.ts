import Line from 'model/Line';
import { aboutLineStepIsValid } from 'scenes/FlexibleLines/scenes/Editor/validateForm';
import { validJourneyPattern } from 'scenes/FlexibleLines/scenes/Editor/JourneyPatterns/Editor/StopPoints/Editor/validateForm';
import { validServiceJourneys } from 'scenes/FlexibleLines/scenes/Editor/ServiceJourneys/Editor/validate';

export const validLine = (line: Line): boolean =>
  aboutLineStepIsValid(line, false) &&
  validJourneyPattern(line.journeyPatterns) &&
  validServiceJourneys(line.journeyPatterns?.[0].serviceJourneys);
