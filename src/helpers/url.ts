import { Event, StackFrame } from '@sentry/types';

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
