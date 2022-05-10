import DayTypeAssignment from './DayTypeAssignment';
import { DAY_OF_WEEK } from './enums';
import { VersionedType } from 'model/VersionedType';

type DayType = VersionedType & {
  changed?: string;
  name?: string;
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

export default DayType;
