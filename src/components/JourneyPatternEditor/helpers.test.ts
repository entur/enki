import { JourneyPatternMarkerType } from '../../ext/JourneyPatternStopPointMap/types';
import JourneyPattern from '../../model/JourneyPattern';
import { getJourneyPatternWithSwappedStopPoints } from './helpers';

const journeyPattern: JourneyPattern = {
  id: 'fsr:JourneyPattern:cd074ad3-1b83-483e-9577-6407b1cecf06',
  name: 's',
  description: null,
  privateCode: null,
  pointsInSequence: [
    {
      key: '1004eb1b451f',
      flexibleStopPlace: undefined,
      quayRef: 'OYM:Quay:79386',
      destinationDisplay: {
        frontText: 's',
      },
      forBoarding: true,
      forAlighting: false,
    },
    {
      key: '5d4c544a3b9e',
      flexibleStopPlace: undefined,
      quayRef: 'OYM:Quay:35143',
      destinationDisplay: null,
      forBoarding: false,
      forAlighting: true,
    },
  ],
  serviceJourneys: [
    {
      id: 'fsr:ServiceJourney:2b796f7c-55f9-40a2-adcd-330737933b06',
      name: 'w',
      description: null,
      privateCode: null,
      publicCode: null,
      operatorRef: null,
      notices: [],
      passingTimes: [
        {
          id: 'fsr:TimetabledPassingTime:f3213aa6-457d-401a-a92b-84cb6a63d7e2',
          arrivalTime: null,
          arrivalDayOffset: 0,
          departureTime: '02:05:00',
          departureDayOffset: 0,
          latestArrivalTime: null,
          latestArrivalDayOffset: 0,
          earliestDepartureTime: null,
          earliestDepartureDayOffset: 0,
        },
        {
          id: 'fsr:TimetabledPassingTime:6e78da6c-c9b4-4e61-985a-14791bfee0f1',
          arrivalTime: '05:06:00',
          arrivalDayOffset: 0,
          departureTime: null,
          departureDayOffset: 0,
          latestArrivalTime: null,
          latestArrivalDayOffset: 0,
          earliestDepartureTime: null,
          earliestDepartureDayOffset: 0,
        },
      ],
    },
  ],
};

const swappedStopPointsJourneyPattern: JourneyPattern = {
  id: 'fsr:JourneyPattern:cd074ad3-1b83-483e-9577-6407b1cecf06',
  name: 's',
  description: null,
  privateCode: null,
  pointsInSequence: [
    {
      key: '5d4c544a3b9e',
      flexibleStopPlace: undefined,
      quayRef: 'OYM:Quay:35143',
      destinationDisplay: null,
      forBoarding: false,
      forAlighting: true,
    },
    {
      key: '1004eb1b451f',
      flexibleStopPlace: undefined,
      quayRef: 'OYM:Quay:79386',
      destinationDisplay: {
        frontText: 's',
      },
      forBoarding: true,
      forAlighting: false,
    },
  ],
  serviceJourneys: [
    {
      id: 'fsr:ServiceJourney:2b796f7c-55f9-40a2-adcd-330737933b06',
      name: 'w',
      description: null,
      privateCode: null,
      publicCode: null,
      operatorRef: null,
      notices: [],
      passingTimes: [
        {
          id: 'fsr:TimetabledPassingTime:6e78da6c-c9b4-4e61-985a-14791bfee0f1',
          arrivalTime: '05:06:00',
          arrivalDayOffset: 0,
          departureTime: null,
          departureDayOffset: 0,
          latestArrivalTime: null,
          latestArrivalDayOffset: 0,
          earliestDepartureTime: null,
          earliestDepartureDayOffset: 0,
        },
        {
          id: 'fsr:TimetabledPassingTime:f3213aa6-457d-401a-a92b-84cb6a63d7e2',
          arrivalTime: null,
          arrivalDayOffset: 0,
          departureTime: '02:05:00',
          departureDayOffset: 0,
          latestArrivalTime: null,
          latestArrivalDayOffset: 0,
          earliestDepartureTime: null,
          earliestDepartureDayOffset: 0,
        },
      ],
    },
  ],
};

describe('Journey pattern editor', () => {
  describe('getJourneyPatternWithSwappedStopPoints', () => {
    it('should return journey pattern with stop points order swapped', () => {
      expect(
        getJourneyPatternWithSwappedStopPoints(0, 1, journeyPattern),
      ).toEqual(swappedStopPointsJourneyPattern);
    });
  });
});
