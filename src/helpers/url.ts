import { Event, StackFrame } from '@sentry/types';
import FlexibleLine from 'model/FlexibleLine';
import { Params } from 'react-router-dom';

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
  params: Params
): FlexibleLine | undefined =>
  flexibleLines.find((flexibleLine) => flexibleLine.id === params.id);
