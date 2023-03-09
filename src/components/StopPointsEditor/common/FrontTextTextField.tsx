import { TextField } from '@entur/form';
import { getErrorFeedback } from 'helpers/errorHandling';
import usePristine from 'hooks/usePristine';
import { useIntl } from 'i18n';
import { MessagesKey } from 'i18n/translations/translationKeys';
import StopPoint from 'model/StopPoint';
import React, { ChangeEvent, useCallback } from 'react';

type Props = {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  frontTextError?: keyof MessagesKey;
  spoilPristine: boolean;
};

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

export const FrontTextTextField = ({
  value,
  onChange,
  disabled = false,
  frontTextError,
  spoilPristine,
}: Props) => {
  const { formatMessage } = useIntl();
  const frontTextPristine = usePristine(value, spoilPristine);

  const onChangeCallback = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <TextField
      className="stop-point-info-item"
      label={formatMessage('labelFrontTextRequired')}
      {...getErrorFeedback(
        frontTextError ? formatMessage(frontTextError) : '',
        !frontTextError,
        frontTextPristine
      )}
      labelTooltip={formatMessage('frontTextTooltip')}
      value={value}
      onChange={onChangeCallback}
      disabled={disabled}
    />
  );
};
