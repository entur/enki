import Versioned from './base/Versioned';

type Data = {
  xmlns: string;
  xmlnsUrl: string;
};

class Codespace extends Versioned {
  xmlns: string;
  xmlnsUrl: string;
  constructor(data?: Data) {
    super(data ?? {});

    this.xmlns = data?.xmlns ?? '';
    this.xmlnsUrl = data?.xmlnsUrl ?? '';
  }
}

export default Codespace;
