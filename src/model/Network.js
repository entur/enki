import Versioned from './base/Versioned';

class Network extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name || '';
    this.description = data.description || '';
    this.privateCode = data.privateCode || '';
    this.authorityRef = data.authorityRef || '';
  }
}

export default Network;
