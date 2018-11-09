import Versioned from './base/Versioned';
import StopPoint from './StopPoint';
import ServiceJourney from './ServiceJourney';
import Notice from './Notice';
import { replaceElement } from '../helpers/arrays';

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
    this.notices = (data.notices || []).map(n => new Notice(n));
  }

  addServiceJourney(serviceJourney) {
    return this.withChanges({
      serviceJourneys: this.serviceJourneys.concat(serviceJourney)
    });
  }

  updateServiceJourney(index, serviceJourney) {
    const serviceJourneys = replaceElement(
      this.serviceJourneys,
      index,
      serviceJourney
    );
    return this.withChanges({ serviceJourneys });
  }

  removeServiceJourney(index) {
    const copy = this.serviceJourneys.slice();
    copy.splice(index, 1);
    return this.withChanges({ serviceJourneys: copy });
  }

  toPayload() {
    return this.withChanges({
      pointsInSequence: this.pointsInSequence.map(pis => pis.toPayload())
    });
  }
}

export default JourneyPattern;
