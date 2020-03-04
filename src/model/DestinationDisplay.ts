import Versioned from './base/Versioned';

type Data = {
  frontText?: string;
};

class DestinationDisplay extends Versioned {
  frontText: string | undefined;

  constructor(data: Data = {}) {
    super(data);

    this.frontText = data.frontText;
  }
}

export default DestinationDisplay;
