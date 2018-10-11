import Versioned from './base/Versioned';
import Codespace from './Codespace';

class Provider extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name || '';
    this.code = data.code || '';
    this.codespace = data.codespace ? new Codespace(data.codespace) : null;
  }
}

export default Provider;
