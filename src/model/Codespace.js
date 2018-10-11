import Versioned from './base/Versioned';

class Codespace extends Versioned {
  constructor(data = {}) {
    super(data);

    this.xmlns = data.xmlns || '';
    this.xmlnsUrl = data.xmlnsUrl || '';
  }
}

export default Codespace;
