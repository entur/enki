import Versioned from './base/Versioned';

class Notice extends Versioned {
  constructor(data = {}) {
    super(data);

    this.text = data.text || '';
  }
}

export default Notice;
