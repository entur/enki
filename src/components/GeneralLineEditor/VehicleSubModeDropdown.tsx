import React, { useCallback } from 'react';
import { Dropdown } from '@entur/dropdown';
import { useIntl } from 'react-intl';
import { mapVehicleSubmodeAndLabelToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import {
  VEHICLE_MODE,
  VEHICLE_SUBMODE,
  VEHICLE_SUBMODE_LINK,
} from 'model/enums';
import usePristine from 'hooks/usePristine';

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
    props.spoilPristine
  );
  const getSubModeItems = useCallback(
    () =>
      props.transportMode
        ? mapVehicleSubmodeAndLabelToItems(
            VEHICLE_SUBMODE_LINK[props.transportMode],
            formatMessage
          )
        : [],
    [props.transportMode, formatMessage]
  );

  return (
    <div key={props.transportMode}>
      <Dropdown
        value={props.transportSubmode}
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
          submodePristine
        )}
      />
    </div>
  );
};

export default VehicleSubModeDropdown;
