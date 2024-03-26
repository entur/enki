import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown';
import { NightIcon } from '@entur/icons';
import { mapEnumToItems } from 'helpers/dropdown';
import { useIntl } from 'react-intl';

type Props = {
  value?: number;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
};

export default ({ value, onChange, disabled = false }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Dropdown
      disabled={disabled}
      style={{ minWidth: '120px' }}
      prepend={<NightIcon inline />}
      selectedItem={mapEnumToItems([value?.toString() ?? '0'])[0]}
      label={formatMessage({ id: 'passingTimesDayOffset' })}
      // @ts-ignore
      labelTooltip={formatMessage({ id: 'passingTimesDayOffsetTooltip' })}
      items={mapEnumToItems(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])}
      onChange={(e: NormalizedDropdownItemType | null) =>
        onChange(parseInt(e?.value || '0'))
      }
    />
  );
};
