import ServiceJourney from 'model/ServiceJourney';
import { isBlank } from 'helpers/forms';
import { validateTimes } from './PassingTimesEditor/validateForm';

export const validateServiceJourney = (sj: ServiceJourney): boolean => {
  const isBlankName = isBlank(sj.name);
  const validDayTimes = (sj.dayTypes?.[0]?.daysOfWeek?.length ?? 0) > 0;
  const { isValid } = validateTimes(sj.passingTimes ?? []);

  return !isBlankName && isValid && validDayTimes;
};
