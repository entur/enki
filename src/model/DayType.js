import Versioned from './base/Versioned';
import DayTypeAssignment from './DayTypeAssignment';

class DayType extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.daysOfWeek = data.daysOfWeek || [];
    this.dayTypeAssignments = (data.dayTypeAssignments || []).map(
      dta => new DayTypeAssignment(dta)
    );
  }
}

export default DayType;
