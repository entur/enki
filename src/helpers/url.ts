import { Event, StackFrame } from '@sentry/types';
import { FlexibleLinesState } from 'reducers/flexibleLines';
import { MatchParams } from 'http/http';
import { VEHICLE_MODE, VEHICLE_SUBMODE } from 'model/enums';
import {initJourneyPatterns} from "model/JourneyPattern";

export const normalizeAllUrls = (data: Event): Event => {
  data.exception?.values?.[0]?.stacktrace?.frames?.forEach(
    (frame: StackFrame) => {
      if (frame?.filename?.startsWith('/')) {
        frame.filename = 'app:///' + frame.filename;
      }
    }
  );
  return data;
};

export const getFlexibleLineFromPath = (
  flexibleLines: FlexibleLinesState,
  match: { params: MatchParams }
) =>
  flexibleLines?.find(
    (flexibleLine) => flexibleLine.id === match.params.id
  ) ?? {
    transportMode: VEHICLE_MODE.BUS,
    transportSubmode: VEHICLE_SUBMODE.LOCAL_BUS,
    journeyPatterns: initJourneyPatterns()
  };
