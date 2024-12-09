import { Event, StackFrame } from '@sentry/types';
import FlexibleLine from 'model/FlexibleLine';
import { Params } from 'react-router-dom';
import { createUuid } from './generators';

export const normalizeAllUrls = (data: Event): Event => {
  data.exception?.values?.[0]?.stacktrace?.frames?.forEach(
    (frame: StackFrame) => {
      if (frame?.filename?.startsWith('/')) {
        frame.filename = 'app:///' + frame.filename;
      }
    },
  );
  return data;
};

export const getFlexibleLineFromPath = (
  flexibleLines: FlexibleLine[],
  params: Params,
): FlexibleLine | undefined => {
  const line = flexibleLines.find(
    (flexibleLine) => flexibleLine.id === params.id,
  );

  // Adding a "key" to each stop point
  return line
    ? {
        ...line,
        journeyPatterns: line.journeyPatterns?.map((jp) => ({
          ...jp,
          pointsInSequence: jp.pointsInSequence.map((pis) => ({
            ...pis,
            key: createUuid(),
          })),
        })),
      }
    : undefined;
};
