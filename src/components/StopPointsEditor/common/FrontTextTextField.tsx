import { TextField, Tooltip } from '@mui/material';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import usePristine from 'hooks/usePristine';
import { MessagesKey } from 'i18n/translationKeys';
import StopPoint from 'model/StopPoint';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';

type Props = {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  frontTextError?: keyof MessagesKey;
  spoilPristine: boolean;
  isFirst?: boolean;
};

export const useOnFrontTextChange = (
  stopPoint: StopPoint,
  onChange: (stopPoint: StopPoint) => void,
) => {
  return useCallback(
    (value: string) =>
      onChange({
        ...stopPoint,
        destinationDisplay: value ? { frontText: value } : null,
      }),
    [onChange, stopPoint],
  );
};

export const FrontTextTextField = ({
  value = '',
  onChange,
  disabled = false,
  frontTextError,
  spoilPristine,
  isFirst = false,
}: Props) => {
  const { formatMessage } = useIntl();
  const frontTextPristine = usePristine(value, spoilPristine);
  const errorProps = getMuiErrorProps(
    frontTextError ? formatMessage({ id: frontTextError }) : '',
    !frontTextError,
    frontTextPristine,
  );
  // This '' thing here is because when it was "undefined" the field wasn't re-rendering to show nothing:
  const frontTextValue = disabled ? '' : value || '';

  const onChangeCallback = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  useEffect(() => {
    if (disabled && value) {
      // Front text needs to get wiped out if field is disabled
      // happens e.g. when reordering or deleting the last stop point
      onChange('');
    }
  }, [value, disabled]);

  return (
    <Tooltip title={formatMessage({ id: 'frontTextTooltip' })} placement="top">
      <TextField
        sx={{ width: 260 }}
        label={formatMessage({
          id: isFirst ? 'labelFrontTextRequired' : 'labelFrontText',
        })}
        {...errorProps}
        value={frontTextValue}
        onChange={onChangeCallback}
        disabled={disabled}
      />
    </Tooltip>
  );
};
