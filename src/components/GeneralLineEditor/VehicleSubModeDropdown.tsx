import { Dropdown } from '@entur/dropdown';
import { mapVehicleSubmodeAndLabelToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import {
  VEHICLE_MODE,
  VEHICLE_SUBMODE,
  VEHICLE_SUBMODE_LINK,
} from 'model/enums';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

type Props = {
  transportMode: VEHICLE_MODE;
  transportSubmode: VEHICLE_SUBMODE | undefined;
  submodeChange: (submode: VEHICLE_SUBMODE) => void;
  spoilPristine: boolean;
};

const VehicleSubModeDropdown = (props: Props) => {
  const { formatMessage } = useIntl();
  const submodePristine = usePristine(
    props.transportSubmode,
    props.spoilPristine,
  );
  const getSubModeItems = useCallback(
    () =>
      props.transportMode
        ? mapVehicleSubmodeAndLabelToItems(
            VEHICLE_SUBMODE_LINK[props.transportMode],
            formatMessage,
          )
        : [],
    [props.transportMode, formatMessage],
  );

  return (
    <div key={props.transportMode}>
      <Dropdown
        selectedItem={
          getSubModeItems().find(
            (item) => item.value === props.transportSubmode,
          ) || null
        }
        placeholder={formatMessage({ id: 'defaultOption' })}
        items={getSubModeItems}
        clearable
        label={formatMessage({ id: 'transportSubModeTitle' })}
        onChange={(element) =>
          props.submodeChange(element?.value as VEHICLE_SUBMODE)
        }
        {...getErrorFeedback(
          formatMessage({ id: 'transportSubModeEmpty' }),
          !isBlank(props.transportSubmode),
          submodePristine,
        )}
      />
    </div>
  );
};

export default VehicleSubModeDropdown;
