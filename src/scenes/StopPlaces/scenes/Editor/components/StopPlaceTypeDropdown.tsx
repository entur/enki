import { Dropdown } from '@entur/dropdown';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import { KeyValues } from 'model/KeyValues';
import {
  FLEXIBLE_STOP_AREA_TYPE,
  flexibleStopAreaTypeMessages,
} from 'model/enums';
import { useIntl } from 'react-intl';

export interface Props {
  label: string;
  keyValues: KeyValues[] | undefined;
  keyValuesUpdate: (keyValues: KeyValues[]) => void;
}

export const StopPlaceTypeDropdown = ({
  label,
  keyValues,
  keyValuesUpdate,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Dropdown
      label={label}
      items={Object.values(FLEXIBLE_STOP_AREA_TYPE).map((v) => ({
        value: v,
        label: formatMessage({
          id: flexibleStopAreaTypeMessages[v],
        }),
      }))}
      value={
        keyValues?.find((v) => v.key === 'FlexibleStopAreaType')?.values[0] ??
        null
      }
      onChange={(selectedItem: NormalizedDropdownItemType | null) =>
        selectedItem &&
        keyValuesUpdate([
          {
            key: 'FlexibleStopAreaType',
            values: [selectedItem.value],
          },
        ])
      }
    />
  );
};
