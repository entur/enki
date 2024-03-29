import { VersionedType } from 'model/VersionedType';
import DayTypeAssignment from './DayTypeAssignment';
import { DAY_OF_WEEK } from './enums';

type DayType = VersionedType & {
  changed?: string;
  name?: string;
  numberOfServiceJourneys?: number;
  daysOfWeek: DAY_OF_WEEK[];
  dayTypeAssignments: DayTypeAssignment[];
};

export const createNewDayType = () => {
  return {
    daysOfWeek: [],
    dayTypeAssignments: [],
  };
};

export const dayTypeIsEmpty = (dayType: DayType) =>
  dayType.daysOfWeek.length === 0 && dayType.dayTypeAssignments.length === 0;

export const dayTypeToPayload = (dayType: DayType) => {
  const { numberOfServiceJourneys, ...payloadFields } = dayType;
  return {
    ...payloadFields,
  };
};

export default DayType;
