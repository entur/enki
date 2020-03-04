import Versioned from './base/Versioned';
import FlexibleArea from './FlexibleArea';
import HailAndRideArea from './HailAndRideArea';

type Data = {
  name?: string;
  description?: string;
  privateCode?: string;
  transportMode?: string;
  flexibleArea?: FlexibleArea;
  hailAndRideArea?: HailAndRideArea;
};

class FlexibleStopPlace extends Versioned {
  name: string | undefined;
  description: string | undefined;
  privateCode: string | undefined;
  transportMode: string | undefined;
  flexibleArea: FlexibleArea | undefined;
  hailAndRideArea: HailAndRideArea | undefined;

  constructor(data: Data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.transportMode = data.transportMode;
    this.flexibleArea = data.flexibleArea
      ? new FlexibleArea(data.flexibleArea)
      : undefined;
    this.hailAndRideArea = data.hailAndRideArea
      ? new HailAndRideArea(data.hailAndRideArea)
      : undefined;
  }
}

export default FlexibleStopPlace;
