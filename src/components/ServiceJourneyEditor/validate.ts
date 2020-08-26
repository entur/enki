import ServiceJourney from 'model/ServiceJourney';
import { isBlank } from 'helpers/forms';
import { validateTimes } from './PassingTimesEditor/validateForm';

export const validServiceJourneys = (
  sjs: ServiceJourney[] | undefined
): boolean => sjs?.every((sj) => validateServiceJourney(sj)) ?? false;

export const validateServiceJourney = (sj: ServiceJourney): boolean => {
  const isBlankName = isBlank(sj.name);
  const validDayTimes = (sj.dayTypes?.[0]?.daysOfWeek?.length ?? 0) > 0;
  const { isValid } = validateTimes(sj.passingTimes ?? []);

  return !isBlankName && isValid && validDayTimes;
};
