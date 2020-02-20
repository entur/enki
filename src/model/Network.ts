import Versioned from './base/Versioned';

type data = {
  name: string;
  description: string;
  privateCode: string;
  authorityRef: string;
};

class Network extends Versioned {
  name: string;
  description: string;
  privateCode: string;
  authorityRef: string;

  constructor(data?: data) {
    super(data || {});

    this.name = data?.name || '';
    this.description = data?.description || '';
    this.privateCode = data?.privateCode || '';
    this.authorityRef = data?.authorityRef || '';
  }
}

export default Network;
