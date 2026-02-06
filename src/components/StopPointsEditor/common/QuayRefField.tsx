import { TextField } from '@mui/material';
import { useQuaySearch } from 'api/useQuaySearch';
import { ErrorHandling } from 'helpers/errorHandling';
import StopPoint from 'model/StopPoint';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import debounce from './debounce';
import { quaySearchResults } from './quaySearchResults';
import { StopPlace } from '../../../api';

interface Props {
  initialQuayRef?: string | null;
  errorFeedback: ErrorHandling;
  onChange: (quayRef: string) => void;
  // The two below are only present in case of GenericStopPointEditor:
  updateStopPlacesInJourneyPattern?: (newStopPlace: StopPlace) => void;
  alreadyFetchedStopPlaces?: StopPlace[];
}

export const useOnQuayRefChange = (
  stopPoint: StopPoint,
  onChange: (stopPoint: StopPoint) => void,
) => {
  const onQuayRefChange = useCallback(
    (quayRef: string) => onChange({ ...stopPoint, quayRef }),
    [onChange, stopPoint],
  );
  return onQuayRefChange;
};

export const QuayRefField = ({
  initialQuayRef,
  errorFeedback,
  onChange,
  updateStopPlacesInJourneyPattern,
  alreadyFetchedStopPlaces,
}: Props) => {
  const { formatMessage } = useIntl();
  const [quayRefInputValue, setQuayRefInputValue] = useState(initialQuayRef);

  const { stopPlace, quay, refetch, loading } = useQuaySearch(
    initialQuayRef,
    quayRefInputValue,
    alreadyFetchedStopPlaces,
  );

  useEffect(() => {
    // If there been a change in the QuayRef field and a new stop place been fetched as part validation,
    // the stopPlacesInJourneyPattern need to get updated with that
    stopPlace &&
      updateStopPlacesInJourneyPattern &&
      !(alreadyFetchedStopPlaces || []).find((s) => s.id === stopPlace.id) &&
      updateStopPlacesInJourneyPattern(stopPlace);
  }, [stopPlace]);

  const quaySearchFeedback = quaySearchResults(
    { stopPlace, quay },
    loading,
    formatMessage({ id: 'quaySearchResults_loadingLabel' }),
    formatMessage({ id: 'quaySearchResults_quayNotFoundLabel' }),
  );

  const debouncedSearchForQuay = useCallback(
    debounce(async (quayRef: string) => {
      await refetch({ id: quayRef });
    }, 1000),
    [],
  );

  useEffect(() => {
    // For some reason no need for this when a general line,
    // but a mixed flexible doesn't work fine without this on occasion of reordering between two "external" stop points
    if (quayRefInputValue !== initialQuayRef) {
      setQuayRefInputValue(initialQuayRef);
    }
  }, [initialQuayRef]);

  // Determine error state: errorFeedback takes precedence over quaySearchFeedback
  const hasError =
    errorFeedback.variant === 'error' && !!errorFeedback.feedback;
  const helperText = hasError
    ? errorFeedback.feedback
    : quaySearchFeedback.feedback || '';

  return (
    <TextField
      sx={{ width: 260 }}
      label={formatMessage({ id: 'labelQuayRef' })}
      error={hasError}
      helperText={helperText}
      value={quayRefInputValue ?? ''}
      placeholder="NSR:Quay:69"
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setQuayRefInputValue(e.target.value);
        debouncedSearchForQuay(e.target.value);
      }}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
    />
  );
};
