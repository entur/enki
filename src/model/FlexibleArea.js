import Versioned from './base/Versioned';

class FlexibleArea extends Versioned {
  constructor(data =  {}) {
    super(data);

    this.name = data.name || '';
    this.description = data.description || '';
    this.privateCode = data.privateCode || '';
    this.polygon = data.polygon || '';
  }
}

export default FlexibleArea;
