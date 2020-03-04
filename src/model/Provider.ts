import Versioned from './base/Versioned';
import Codespace from './Codespace';

type Data = {
  name?: string;
  code?: string;
  codespace?: Codespace | null;
};

class Provider extends Versioned {
  name: string;
  code: string;
  codespace: Codespace | null;

  constructor(data: Data = {}) {
    super(data);

    this.name = data.name || '';
    this.code = data.code || '';
    this.codespace = data.codespace ? new Codespace(data.codespace) : null;
  }
}

export default Provider;
