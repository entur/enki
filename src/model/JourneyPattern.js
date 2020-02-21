import Versioned from './base/Versioned';
import StopPoint from './StopPoint';
import ServiceJourney from './ServiceJourney';

class JourneyPattern extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.directionType = data.directionType;
    this.pointsInSequence = (data.pointsInSequence || []).map(
      p => new StopPoint(p)
    );
    this.serviceJourneys = (data.serviceJourneys || []).map(
      sj => new ServiceJourney(sj)
    );
    this.notices = (data.notices || []).map(n => ({ ...n }));
  }

  toPayload() {
    return this.withChanges({
      pointsInSequence: this.pointsInSequence.map(pis => pis.toPayload())
    });
  }
}

export default JourneyPattern;
