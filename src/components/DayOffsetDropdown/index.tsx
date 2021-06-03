import React from 'react';
import { Dropdown } from '@entur/dropdown';
import { NightIcon } from '@entur/icons';
import { mapEnumToItems } from 'helpers/dropdown';
import { selectIntl } from 'i18n';
import { useSelector } from 'react-redux';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';

type Props = {
  value?: number;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
};

export default ({ value, onChange, disabled = false }: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <Dropdown
      disabled={disabled}
      style={{ minWidth: '120px' }}
      prepend={<NightIcon inline />}
      value={value?.toString() ?? '0'}
      label={formatMessage('passingTimesDayOffset')}
      labelTooltip={formatMessage('passingTimesDayOffsetTooltip')}
      items={mapEnumToItems(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])}
      onChange={(e: NormalizedDropdownItemType | null) =>
        onChange(parseInt(e?.value || '0'))
      }
    />
  );
};
