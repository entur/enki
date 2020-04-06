import { Event, StackFrame } from '@sentry/types';
import { MatchParams } from 'http/http';
import FlexibleLine from 'model/FlexibleLine';

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
  flexibleLines: FlexibleLine[],
  match: { params: MatchParams }
): FlexibleLine =>
  flexibleLines.find((flexibleLine) => flexibleLine.id === match.params.id) ??
  flexibleLines[0];
