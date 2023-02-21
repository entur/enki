import { Dropdown } from '@entur/dropdown';
import { useConfig } from 'config/ConfigContext';
import { mapFlexibleLineTypeAndLabelToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { selectIntl } from 'i18n';
import { FlexibleLineType } from 'model/FlexibleLine';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import FlexibleLineTypeDrawer from './FlexibleLineTypeDrawer';
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
  const { formatMessage } = useSelector(selectIntl);
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
        aria-label={formatMessage('drawerAria')}
        onClick={() => setDrawer(true)}
      >
        {formatMessage('typeFormGroupTitleTooltip')}
      </div>
      {
        <Dropdown
          className="flexible-line-type"
          value={flexibleLineType}
          placeholder={formatMessage('defaultOption')}
          items={getDropdownItems}
          clearable
          label={formatMessage('generalTypeFormGroupTitle')}
          onChange={(element) => onChange(element?.value as FlexibleLineType)}
          {...getErrorFeedback(
            formatMessage('flexibleLineTypeEmpty'),
            !isBlank(flexibleLineType),
            flexibleLineTypePristine
          )}
        />
      }

      <FlexibleLineTypeDrawer
        open={showDrawer}
        onDismiss={() => setDrawer(false)}
        title={formatMessage('generalDrawerTitle')}
      />
    </>
  );
};
