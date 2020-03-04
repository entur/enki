import Versioned from './base/Versioned';

type Data = {
  name?: string;
  description?: string;
  privateCode?: string;
  startQuayRef?: string;
  endQuayRef?: string;
};

class HailAndRideArea extends Versioned {
  name: string;
  description: string;
  privateCode: string;
  startQuayRef: string;
  endQuayRef: string;

  constructor(data: Data = {}) {
    super(data);

    this.name = data.name || '';
    this.description = data.description || '';
    this.privateCode = data.privateCode || '';
    this.startQuayRef = data.startQuayRef || '';
    this.endQuayRef = data.endQuayRef || '';
  }
}

export default HailAndRideArea;
