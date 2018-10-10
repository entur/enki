import Versioned from './base/Versioned';

class HailAndRideArea extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name || '';
    this.description = data.description || '';
    this.privateCode = data.privateCode || '';
    this.startQuayRef = data.startQuayRef || '';
    this.endQuayRef = data.endQuayRef || '';
  }
}

export default HailAndRideArea;
