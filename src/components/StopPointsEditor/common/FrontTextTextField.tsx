import { TextField } from '@entur/form';
import { getErrorFeedback } from 'helpers/errorHandling';
import usePristine from 'hooks/usePristine';
import { MessagesKey } from 'i18n/translations/translationKeys';
import StopPoint from 'model/StopPoint';
import React, { ChangeEvent, useCallback } from 'react';
import { useIntl } from 'react-intl';

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
      label={formatMessage({ id: 'labelFrontTextRequired' })}
      {...getErrorFeedback(
        frontTextError ? formatMessage({ id: frontTextError }) : '',
        !frontTextError,
        frontTextPristine
      )}
      labelTooltip={formatMessage({ id: 'frontTextTooltip' })}
      value={value}
      onChange={onChangeCallback}
      disabled={disabled}
    />
  );
};
