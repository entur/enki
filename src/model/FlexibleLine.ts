import Versioned from './base/Versioned';
import BookingArrangement from './BookingArrangement';
import JourneyPattern, { journeyPatternToPayload } from './JourneyPattern';
import { replaceElement } from 'helpers/arrays';
import Notice from './Notice';
import { Network } from './Network';

type Data = {
  name?: string;
  description?: string;
  privateCode?: string;
  publicCode?: string;
  transportMode?: string;
  transportSubmode?: string;
  flexibleLineType?: string;
  network?: Network;
  networkRef?: string;
  operatorRef?: string;
  bookingArrangement?: BookingArrangement;
  journeyPatterns?: JourneyPattern[];
  notices?: Notice[];
};

class FlexibleLine extends Versioned {
  name: string | undefined;
  description: string | undefined;
  privateCode: string | undefined;
  publicCode: string | undefined;
  transportMode: string | undefined;
  transportSubmode: string | undefined;
  flexibleLineType: string | undefined;
  network: Network | undefined;
  networkRef: string | undefined;
  operatorRef: string | undefined;
  bookingArrangement: BookingArrangement | undefined;
  journeyPatterns: JourneyPattern[];
  notices: Notice[];

  constructor(data: Data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.publicCode = data.publicCode;
    this.transportMode = data.transportMode;
    this.transportSubmode = data.transportSubmode;
    this.flexibleLineType = data.flexibleLineType;
    this.network = data.network;
    this.networkRef = data.networkRef ?? data.network?.id;
    this.operatorRef = data.operatorRef;
    this.bookingArrangement = data.bookingArrangement;
    this.journeyPatterns = data.journeyPatterns || [];
    this.notices = (data.notices || []).map(n => ({ ...n }));
  }

  addJourneyPattern(journeyPattern: JourneyPattern) {
    return this.withChanges({
      journeyPatterns: this.journeyPatterns.concat(journeyPattern)
    });
  }

  updateJourneyPattern(index: number, journeyPattern: JourneyPattern) {
    const journeyPatterns = replaceElement(
      this.journeyPatterns,
      index,
      journeyPattern
    );
    return this.withChanges({ journeyPatterns });
  }

  removeJourneyPattern(index: number) {
    const copy = this.journeyPatterns.slice();
    copy.splice(index, 1);
    return this.withChanges({ journeyPatterns: copy });
  }

  toPayload() {
    let payload = this.withChanges({
      journeyPatterns: this.journeyPatterns.map(jp =>
        journeyPatternToPayload(jp)
      )
    });
    // The network property is only present when loading.
    delete payload.network;
    return payload;
  }
}

export default FlexibleLine;
