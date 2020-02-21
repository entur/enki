import Versioned from './base/Versioned';

type Data = {
  name?: string;
  description?: string;
  privateCode?: string;
  authorityRef: string;
};

class Network extends Versioned {
  name: string;
  description: string;
  privateCode: string;
  authorityRef: string;

  constructor(data?: Data) {
    super(data || {});

    this.name = data?.name || '';
    this.description = data?.description || '';
    this.privateCode = data?.privateCode || '';
    this.authorityRef = data?.authorityRef || '';
  }
}

export default Network;
