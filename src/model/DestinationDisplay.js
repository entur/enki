import Versioned from './base/Versioned';

class DestinationDisplay extends Versioned {
  constructor(data = {}) {
    super(data);

    this.frontText = data.frontText || '';
  }
}

export default DestinationDisplay;
