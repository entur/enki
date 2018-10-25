import Versioned from './base/Versioned';
import StopPointInJourneyPattern from './StopPointInJourneyPattern';
import ServiceJourney from './ServiceJourney';
import Notice from './Notice';

class JourneyPattern extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.directionType = data.directionType;
    this.pointsInSequence = (data.pointsInSequence || []).map(
      p => new StopPointInJourneyPattern(p)
    );
    this.serviceJourneys = (data.serviceJourneys || []).map(
      sj => new ServiceJourney(sj)
    );
    this.notices = (data.notices || []).map(n => new Notice(n));
  }

  toPayload() {
    return this.withChanges({
      pointsInSequence: this.pointsInSequence.map(pis => pis.toPayload())
    });
  }
}

export default JourneyPattern;
