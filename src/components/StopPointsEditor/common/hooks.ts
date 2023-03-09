import StopPoint from 'model/StopPoint';
import { useCallback } from 'react';

export const useOnFrontTextChange = (
  stopPoint: StopPoint,
  onChange: (stopPoint: StopPoint) => void
) => {
  return useCallback(
    (value: string) =>
      onChange({
        ...stopPoint,
        destinationDisplay: value ? { frontText: value } : null,
      }),
    [onChange, stopPoint]
  );
};
