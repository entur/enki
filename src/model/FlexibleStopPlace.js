import Versioned from './base/Versioned';
import FlexibleArea from './FlexibleArea';
import HailAndRideArea from './HailAndRideArea';

class FlexibleStopPlace extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name || '';
    this.description = data.description || '';
    this.privateCode = data.privateCode || '';
    this.transportMode = data.transportMode || '';
    this.flexibleArea = data.flexibleArea
      ? new FlexibleArea(data.flexibleArea)
      : null;
    this.hailAndRideArea = data.hailAndRideArea
      ? new HailAndRideArea(data.hailAndRideArea)
      : null;
  }
}

export default FlexibleStopPlace;
