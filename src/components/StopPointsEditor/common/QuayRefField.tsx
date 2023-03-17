import React, { ChangeEvent, useCallback, useState } from 'react';
import { TextField } from '@entur/form';
import { quaySearchResults } from './quaySearchResults';
import debounce from './debounce';
import { useSelector } from 'react-redux';
import { GlobalState } from 'reducers';
import { AppIntlState, selectIntl } from 'i18n';
import { ErrorHandling } from 'helpers/errorHandling';
import { useQuaySearch } from 'api/useQuaySearch';
import StopPoint from 'model/StopPoint';

interface Props {
  initialQuayRef?: string | null;
  errorFeedback: ErrorHandling;
  onChange: (quayRef: string) => void;
}

export const useOnQuayRefChange = (
  stopPoint: StopPoint,
  onChange: (stopPoint: StopPoint) => void
) => {
  const onQuayRefChange = useCallback(
    (quayRef: string) => onChange({ ...stopPoint, quayRef }),
    [onChange, stopPoint]
  );
  return onQuayRefChange;
};

export const QuayRefField = ({
  initialQuayRef,
  errorFeedback,
  onChange,
}: Props) => {
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  const [quayRefInputValue, setQuayRefInputValue] = useState(initialQuayRef);

  const { stopPlace, quay, refetch, loading } = useQuaySearch(
    initialQuayRef,
    quayRefInputValue
  );

  const quaySearchFeedback = quaySearchResults(
    { stopPlace, quay },
    loading,
    formatMessage('quaySearchResults_loadingLabel'),
    formatMessage('quaySearchResults_quayNotFoundLabel')
  );

  const debouncedSearchForQuay = useCallback(
    debounce(async (quayRef: string) => {
      refetch({ id: quayRef });
    }, 1000),
    []
  );

  return (
    <TextField
      className="stop-point-info-item"
      label={formatMessage('labelQuayRef')}
      {...errorFeedback}
      {...quaySearchFeedback}
      value={quayRefInputValue!}
      placeholder="NSR:Quay:69"
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setQuayRefInputValue(e.target.value);
        debouncedSearchForQuay(e.target.value);
      }}
      onBlur={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  );
};
