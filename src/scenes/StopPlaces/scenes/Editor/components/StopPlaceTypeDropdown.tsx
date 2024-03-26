import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown';
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
      clearable
      label={label}
      items={Object.values(FLEXIBLE_STOP_AREA_TYPE).map((v) => ({
        value: v,
        label: formatMessage({
          id: flexibleStopAreaTypeMessages[v],
        }),
      }))}
      selectedItem={{
        value:
          keyValues?.find((v) => v.key === 'FlexibleStopAreaType')?.values[0] ||
          '',
        label: keyValues?.find((v) => v.key === 'FlexibleStopAreaType')
          ?.values[0]
          ? formatMessage({
              id: flexibleStopAreaTypeMessages[
                keyValues?.find((v) => v.key === 'FlexibleStopAreaType')
                  ?.values[0]! as FLEXIBLE_STOP_AREA_TYPE
              ],
            })
          : '',
      }}
      onChange={(selectedItem: NormalizedDropdownItemType | null) => {
        if (selectedItem) {
          keyValuesUpdate([
            {
              key: 'FlexibleStopAreaType',
              values: [selectedItem.value],
            },
          ]);
        } else {
          keyValuesUpdate([]);
        }
      }}
    />
  );
};
