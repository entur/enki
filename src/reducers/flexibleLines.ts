import {
  RECEIVE_FLEXIBLE_LINES,
  RECEIVE_FLEXIBLE_LINE,
  FlexibleLinesAction,
} from 'actions/flexibleLines';
import FlexibleLine from '../model/FlexibleLine';
import PassingTime from 'model/PassingTime';
import JourneyPattern from 'model/JourneyPattern';
import { SET_ACTIVE_PROVIDER } from 'actions/providers';

export type FlexibleLinesState = FlexibleLine[] | null;

const cleanUpPassingTimes = (pt: PassingTime): PassingTime => {
  if (pt.departureTime)
    return {
      departureTime: pt.departureTime,
      arrivalTime: pt.departureTime,
      departureDayOffset: pt.departureDayOffset,
      arrivalDayOffset: pt.departureDayOffset,
    };
  else if (pt.latestArrivalTime)
    return {
      departureTime: pt.latestArrivalTime,
      arrivalTime: pt.latestArrivalTime,
      departureDayOffset: pt.latestArrivalDayOffset,
      arrivalDayOffset: pt.latestArrivalDayOffset,
    };
  else if (pt.arrivalTime)
    return {
      departureTime: pt.arrivalTime,
      arrivalTime: pt.arrivalTime,
      departureDayOffset: pt.arrivalDayOffset,
      arrivalDayOffset: pt.arrivalDayOffset,
    };
  else if (pt.earliestDepartureTime)
    return {
      departureTime: pt.earliestDepartureTime,
      arrivalTime: pt.earliestDepartureTime,
      departureDayOffset: pt.earliestDepartureDayOffset,
      arrivalDayOffset: pt.earliestDepartureDayOffset,
    };
  else return {};
};

const flexibleLines = (
  lines: FlexibleLinesState = null,
  action: FlexibleLinesAction
): FlexibleLinesState => {
  switch (action.type) {
    case RECEIVE_FLEXIBLE_LINES:
      return action.lines;

    case RECEIVE_FLEXIBLE_LINE:
      const newJourneyPatterns: JourneyPattern[] =
        action.line?.journeyPatterns?.map((jp) => ({
          ...jp,
          pointsInSequence: jp.pointsInSequence.map((pis) => ({
            ...pis,
            flexibleStopPlaceRef: pis.flexibleStopPlace?.id,
          })),
          serviceJourneys: jp.serviceJourneys.map((sj) => ({
            ...sj,
            passingTimes: sj.passingTimes.map((pt) => cleanUpPassingTimes(pt)),
          })),
        })) ?? [];

      const newFlexibleLine: FlexibleLine = {
        ...action.line,
        networkRef: action.line.network?.id,
        journeyPatterns: newJourneyPatterns,
      };

      return (
        lines?.map((l) => (l.id === action.line.id ? newFlexibleLine : l)) ?? [
          newFlexibleLine,
        ]
      );

    case SET_ACTIVE_PROVIDER:
      return null;

    default:
      return lines;
  }
};

export default flexibleLines;
