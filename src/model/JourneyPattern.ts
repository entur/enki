import Versioned from './base/Versioned';
import StopPoint, { stopPointToPayload } from './StopPoint';
import ServiceJourney from './ServiceJourney';
import Notice from './Notice';
import { DIRECTION_TYPE } from 'model/enums';

type Data = {
  name?: string;
  description?: string;
  privateCode?: string;
  directionType?: DIRECTION_TYPE;
  pointsInSequence?: StopPoint[];
  serviceJourneys?: ServiceJourney[];
  notices?: Notice[];
};

class JourneyPattern extends Versioned {
  name: string | undefined;
  description: string | undefined;
  privateCode: string | undefined;
  directionType: DIRECTION_TYPE | undefined;
  pointsInSequence: StopPoint[];
  serviceJourneys: ServiceJourney[];
  notices: Notice[];

  constructor(data: Data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.directionType = data.directionType;
    this.pointsInSequence = data.pointsInSequence || [{}, {}];
    this.serviceJourneys = data.serviceJourneys || [{ passingTimes: [{}, {}] }];
    this.notices = (data.notices || []).map(n => ({ ...n }));
  }

  toPayload() {
    return this.withChanges({
      pointsInSequence: this.pointsInSequence.map(pis =>
        stopPointToPayload(pis)
      )
    });
  }
}

export default JourneyPattern;
