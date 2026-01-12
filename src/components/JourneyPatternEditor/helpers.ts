import JourneyPattern from '../../model/JourneyPattern';
import StopPoint from '../../model/StopPoint';
import ServiceJourney from '../../model/ServiceJourney';

export const getJourneyPatternWithSwappedStopPoints = (
  positionIndex1: number,
  positionIndex2: number,
  journeyPattern: JourneyPattern,
): JourneyPattern => {
  const newPointsInSequence: StopPoint[] = [...journeyPattern.pointsInSequence];
  newPointsInSequence[positionIndex1] =
    journeyPattern.pointsInSequence[positionIndex2];
  newPointsInSequence[positionIndex2] =
    journeyPattern.pointsInSequence[positionIndex1];

  const newServiceJourneys: ServiceJourney[] = [];
  for (let i = 0; i < journeyPattern.serviceJourneys.length; i++) {
    const newPassingTimes = [...journeyPattern.serviceJourneys[i].passingTimes];
    newPassingTimes[positionIndex1] =
      journeyPattern.serviceJourneys[i].passingTimes[positionIndex2];
    newPassingTimes[positionIndex2] =
      journeyPattern.serviceJourneys[i].passingTimes[positionIndex1];
    const newServiceJourney = {
      ...journeyPattern.serviceJourneys[i],
      passingTimes: newPassingTimes,
    };
    newServiceJourneys.push(newServiceJourney);
  }

  return {
    ...journeyPattern,
    pointsInSequence: newPointsInSequence,
    serviceJourneys: newServiceJourneys,
  };
};
