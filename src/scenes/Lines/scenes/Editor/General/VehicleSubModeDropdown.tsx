import React from 'react';
import { Dropdown } from '@entur/dropdown';
import { useSelector } from 'react-redux';
import {
  mapVehicleSubmodeAndLabelToItems,
  vehicleSubmodeInit,
} from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import { selectIntl } from 'i18n';
import {
  VEHICLE_MODE,
  VEHICLE_SUBMODE,
  VEHICLE_SUBMODE_LINK,
} from 'model/enums';
import { usePristine } from '../hooks';

type Props = {
  transportMode: VEHICLE_MODE;
  transportSubmode: VEHICLE_SUBMODE | undefined;
  submodeChange: (submode: VEHICLE_SUBMODE) => void;
  spoilPristine: boolean;
};

const VehicleSubModeDropdown = (props: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const submodePristine = usePristine(
    props.transportSubmode,
    props.spoilPristine
  );
  const subModeItems = props.transportMode
    ? mapVehicleSubmodeAndLabelToItems(
        VEHICLE_SUBMODE_LINK[props.transportMode],
        formatMessage
      )
    : [];

  return (
    <div key={props.transportMode}>
      <Dropdown
        initialSelectedItem={vehicleSubmodeInit(
          VEHICLE_SUBMODE_LINK[props.transportMode],
          formatMessage,
          props.transportSubmode
        )}
        placeholder={formatMessage('defaultOption')}
        items={subModeItems}
        clearable
        label={formatMessage('transportSubModeTitle')}
        onChange={(element) =>
          props.submodeChange(element?.value as VEHICLE_SUBMODE)
        }
        {...getErrorFeedback(
          formatMessage('transportSubModeEmpty'),
          !isBlank(props.transportSubmode),
          submodePristine
        )}
      />
    </div>
  );
};

export default VehicleSubModeDropdown;
