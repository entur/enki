import Versioned from './base/Versioned';
import DayTypeAssignment from './DayTypeAssignment';
import { DAY_OF_WEEK } from './enums';

type Props = {
  daysOfWeek?: DAY_OF_WEEK[];
  dayTypeAssignments?: DayTypeAssignment[];
};

class DayType extends Versioned {
  daysOfWeek: DAY_OF_WEEK[];
  dayTypeAssignments: DayTypeAssignment[];

  constructor(data: Props = {}) {
    super(data);

    this.daysOfWeek = data.daysOfWeek || [];
    this.dayTypeAssignments = (data.dayTypeAssignments || []).map(
      dta => new DayTypeAssignment(dta)
    );
  }

  isEmpty() {
    return this.daysOfWeek.length === 0 && this.dayTypeAssignments.length === 0;
  }
}

export default DayType;
