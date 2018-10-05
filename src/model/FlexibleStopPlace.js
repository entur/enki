import Base from './Base';

class FlexibleStopPlace extends Base {
  constructor(data = {}) {
    super();

    this.name = data.name || '';
    this.validity = data.validity || '';
    this.polygon = data.polygon || [];
  }
}

export default FlexibleStopPlace;
