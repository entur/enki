import { Dropdown } from '@entur/dropdown';
import { useConfig } from 'config/ConfigContext';
import { mapFlexibleLineTypeAndLabelToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { FlexibleLineType } from 'model/FlexibleLine';
import React, { useCallback, useState } from 'react';
import FlexibleLineTypeDrawer from './FlexibleLineTypeDrawer';
import { useIntl } from 'react-intl';
import './styles.scss';

interface Props {
  flexibleLineType: FlexibleLineType | undefined;
  onChange: (flexibleLineType: FlexibleLineType) => void;
  spoilPristine: boolean;
}

export const FlexibleLineTypeSelector = ({
  flexibleLineType,
  onChange,
  spoilPristine,
}: Props) => {
  const [showDrawer, setDrawer] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const flexibleLineTypePristine = usePristine(flexibleLineType, spoilPristine);
  const { supportedFlexibleLineTypes } = useConfig();

  const getDropdownItems = useCallback(() => {
    const mappedFlexibleLineTypes = (
      Object.values(FlexibleLineType) as Array<FlexibleLineType>
    ).filter((e) => supportedFlexibleLineTypes?.includes(e));

    return mapFlexibleLineTypeAndLabelToItems(
      mappedFlexibleLineTypes,
      formatMessage
    );
  }, [supportedFlexibleLineTypes, formatMessage]);

  return (
    <>
      <div
        className="line-type-dropdown-tooltip"
        aria-label={formatMessage({ id: 'drawerAria' })}
        onClick={() => setDrawer(true)}
      >
        {formatMessage({ id: 'typeFormGroupTitleTooltip' })}
      </div>
      {
        <Dropdown
          className="flexible-line-type"
          value={flexibleLineType}
          placeholder={formatMessage({ id: 'defaultOption' })}
          items={getDropdownItems}
          clearable
          label={formatMessage({ id: 'generalTypeFormGroupTitle' })}
          onChange={(element) => onChange(element?.value as FlexibleLineType)}
          {...getErrorFeedback(
            formatMessage({ id: 'flexibleLineTypeEmpty' }),
            !isBlank(flexibleLineType),
            flexibleLineTypePristine
          )}
        />
      }

      <FlexibleLineTypeDrawer
        open={showDrawer}
        onDismiss={() => setDrawer(false)}
        title={formatMessage({ id: 'generalDrawerTitle' })}
      />
    </>
  );
};
