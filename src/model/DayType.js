import Versioned from './base/Versioned';
import DayTypeAssignment from './DayTypeAssignment';

class DayType extends Versioned {
  constructor(data = {}) {
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
