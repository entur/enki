import { isBlank } from 'helpers/forms';
import FlexibleLine, { FlexibleLineType } from 'model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';
import Line from 'model/Line';
import ServiceJourney from 'model/ServiceJourney';
import { IntlShape } from 'react-intl';

import {
  validateStopPoints,
  validateFlexibleAreasOnlyStopPoints,
} from './stopPoint';
import { validateTimes } from './passingTime';
import { validateDayTypes } from './dayType';

export const validLine = (
  line: Line,
  intl: IntlShape,
  optionalPublicCode?: boolean,
): boolean =>
  aboutLineStepIsValid(line, optionalPublicCode) &&
  line.journeyPatterns!.every(
    (jp) =>
      validJourneyPattern(jp) && validServiceJourneys(jp.serviceJourneys, intl),
  );

export const validFlexibleLine = (
  line: FlexibleLine,
  intl: IntlShape,
  optionalPublicCode?: boolean,
): boolean =>
  aboutFlexibleLineStepIsValid(line, optionalPublicCode) &&
  line.journeyPatterns!.every(
    (jp) =>
      validFlexibleLineJourneyPattern(jp, line.flexibleLineType) &&
      validServiceJourneys(jp.serviceJourneys, intl),
  );

export const aboutLineStepIsValid = (
  line: Line,
  optionalPublicCode?: boolean,
): boolean =>
  !isBlank(line.name) &&
  (!isBlank(line.publicCode) || !!optionalPublicCode) &&
  !isBlank(line.operatorRef) &&
  !isBlank(line.networkRef) &&
  !isBlank(line.transportMode) &&
  !isBlank(line.transportSubmode);

export const aboutFlexibleLineStepIsValid = (
  line: FlexibleLine,
  optionalPublicCode?: boolean,
): boolean =>
  aboutLineStepIsValid(line, optionalPublicCode) &&
  !isBlank(line.flexibleLineType);

export const validJourneyPattern = (
  journeyPatterns?: JourneyPattern,
): boolean =>
  !!journeyPatterns &&
  !isBlank(journeyPatterns.name) &&
  validateStopPoints(journeyPatterns.pointsInSequence ?? []);

export const validFlexibleLineJourneyPattern = (
  journeyPatterns?: JourneyPattern,
  flexibleLineType?: FlexibleLineType,
): boolean => {
  if (flexibleLineType === FlexibleLineType.FLEXIBLE_AREAS_ONLY) {
    return (
      !!journeyPatterns &&
      !isBlank(journeyPatterns.name) &&
      validateFlexibleAreasOnlyStopPoints(
        journeyPatterns.pointsInSequence ?? [],
      )
    );
  } else {
    return validJourneyPattern(journeyPatterns);
  }
};

export const validServiceJourneys = (
  sjs: ServiceJourney[] | undefined,
  intl: IntlShape,
): boolean => sjs?.every((sj) => validateServiceJourney(sj, intl)) ?? false;

export const validateServiceJourney = (
  sj: ServiceJourney,
  intl: IntlShape,
): boolean => {
  const isBlankName = isBlank(sj.name);
  const validDayTimes = (sj.dayTypes?.[0]?.daysOfWeek?.length ?? 0) > 0;
  const { isValid } = validateTimes(sj.passingTimes ?? [], intl);
  const validDayTypes = validateDayTypes(sj.dayTypes);
  return !isBlankName && isValid && validDayTimes && validDayTypes;
};

export const getMaxAllowedStepIndex = (
  line: Line,
  intl: IntlShape,
  optionalPublicCode?: boolean,
) => {
  if (!aboutLineStepIsValid(line, optionalPublicCode)) return 0;
  else if (line.journeyPatterns!.some((jp) => !validJourneyPattern(jp)))
    return 1;
  else if (
    line.journeyPatterns!.some(
      (jp) => !validServiceJourneys(jp.serviceJourneys, intl),
    )
  )
    return 2;
  else return 3;
};

export const getMaxAllowedFlexibleLineStepIndex = (
  line: FlexibleLine,
  intl: IntlShape,
  optionalPublicCode?: boolean,
) => {
  if (!aboutFlexibleLineStepIsValid(line, optionalPublicCode)) return 0;
  else if (
    line.journeyPatterns!.some(
      (jp) => !validFlexibleLineJourneyPattern(jp, line.flexibleLineType),
    )
  )
    return 1;
  else if (
    line.journeyPatterns!.some(
      (jp) => !validServiceJourneys(jp.serviceJourneys, intl),
    )
  )
    return 2;
  else return 3;
};

export const currentStepIsValid = (
  currentStep: number,
  line: Line,
  intl: IntlShape,
  optionalPublicCode?: boolean,
) => {
  if (currentStep === 0) return aboutLineStepIsValid(line, optionalPublicCode);
  else if (currentStep === 1)
    return line.journeyPatterns!.every((jp) => validJourneyPattern(jp));
  else if (currentStep === 2)
    return line.journeyPatterns!.every((jp) =>
      validServiceJourneys(jp.serviceJourneys, intl),
    );
  else if (currentStep === 3) return true;
  else return false;
};

export const currentFlexibleLineStepIsValid = (
  currentStep: number,
  line: FlexibleLine,
  intl: IntlShape,
  optionalPublicCode?: boolean,
) => {
  if (currentStep === 0)
    return aboutFlexibleLineStepIsValid(line, optionalPublicCode);
  else if (currentStep === 1)
    return line.journeyPatterns!.every((jp) =>
      validFlexibleLineJourneyPattern(jp, line.flexibleLineType),
    );
  else if (currentStep === 2)
    return line.journeyPatterns!.every((jp) =>
      validServiceJourneys(jp.serviceJourneys, intl),
    );
  else if (currentStep === 3) return true;
  else return false;
};
