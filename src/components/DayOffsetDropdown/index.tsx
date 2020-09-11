import React from 'react';
import { Dropdown } from '@entur/dropdown';
import { NightIcon } from '@entur/icons';
import { getEnumInit, mapEnumToItems } from 'helpers/dropdown';
import { selectIntl } from 'i18n';
import { useSelector } from 'react-redux';

type Props = {
  initialValue?: number;
  onChange: (value: number | undefined) => void;
};

export default ({ initialValue, onChange }: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <Dropdown
      prepend={<NightIcon inline />}
      initialSelectedItem={getEnumInit(initialValue?.toString() ?? '0')}
      label={formatMessage('passingTimesDayOffset')}
      labelTooltip={formatMessage('passingTimesDayOffsetTooltip')}
      items={mapEnumToItems(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])}
      onChange={(e) => onChange(e?.value as number | undefined)}
    />
  );
};
