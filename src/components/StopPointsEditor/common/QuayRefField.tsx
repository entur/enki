import { TextField } from '@entur/form';
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
  onUpdateStopPlacesUsedInLineIndex: (stopPlace: StopPlace) => void;
  existingStopPlace: StopPlace | undefined;
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
  onUpdateStopPlacesUsedInLineIndex,
  existingStopPlace,
}: Props) => {
  const { formatMessage } = useIntl();
  const [quayRefInputValue, setQuayRefInputValue] = useState(initialQuayRef);

  const { stopPlace, quay, refetch, loading } = useQuaySearch(
    initialQuayRef,
    quayRefInputValue,
    existingStopPlace,
  );

  useEffect(() => {
    if (stopPlace) {
      onUpdateStopPlacesUsedInLineIndex(stopPlace);
    }
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

  return (
    <TextField
      className="stop-point-info-item"
      label={formatMessage({ id: 'labelQuayRef' })}
      {...errorFeedback}
      {...quaySearchFeedback}
      value={quayRefInputValue ?? ''}
      placeholder="NSR:Quay:69"
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setQuayRefInputValue(e.target.value);
        debouncedSearchForQuay(e.target.value);
      }}
      onBlur={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  );
};
